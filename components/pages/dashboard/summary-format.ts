/** Presentation only. Never generates, ranks, diagnoses or rewrites report content. */
export function paragraphsForReading(text:unknown, locale='es'):string[] {
  if(typeof text!=='string'||!text.trim()) return [];
  const authored=text.replace(/\r\n?/g,'\n').trim().split(/\n[\t ]*\n+/).filter(p=>p.trim());
  // Existing author breaks are authoritative, even when an individual paragraph is long.
  if(authored.length!==1)return authored;
  const block=authored[0],words=(value:string)=>value.trim().split(/\s+/u).filter(Boolean).length;
  if(words(block)<=100||block.includes('\n')||/^\s*(?:[-*#•]|\d+[.)])/u.test(block)||typeof Intl.Segmenter!=='function')return authored;

  // Record positions outside balanced brackets/quotes before considering sentence breaks.
  // A malformed structure is not an invitation to guess where its qualification ends.
  const safe=new Set<number>(),stack:string[]=[];let quote:string|null=null,malformed=false;
  const closing:Record<string,string>={'(':')','[':']','{':'}'},quotes:Record<string,string>={'"':'"','«':'»','“':'”','„':'”',"'":"'",'‘':'’'};
  const letter=(value:string|undefined)=>Boolean(value&&/[\p{L}\p{N}]/u.test(value));
  for(let i=0;i<block.length;i++){
    if(!stack.length&&!quote)safe.add(i);
    const char=block[i];
    // Apostrophes inside words, and possessive trailing apostrophes, are not open quotes.
    const apostrophe=(char==="'"||char==='’')&&letter(block[i-1])&&(letter(block[i+1])||!quote);
    if(apostrophe)continue;
    if(quote){if(char===quote)quote=null;continue;}
    if(quotes[char]){quote=quotes[char];continue;}
    if(closing[char])stack.push(closing[char]);
    else if(')]}'.includes(char)&&stack.pop()!==char)malformed=true;
  }
  if(stack.length||quote||malformed)return authored;

  // Conservative attachment guards; these are not a classifier of medical meaning.
  const dependent=/^(?:pero|sin(?:\s+embargo)?|aunque|no(?:\s+obstante)?|ni|tampoco|además|también|por\s+(?:sí\s+solo|eso|tanto|lo\s+tanto|ejemplo)|en\s+cambio|aun\s+así|esto|estos|esta|estas|este|esa|esas|ese|esos|ello|lo\s+que|but|however|although|nevertheless|nonetheless|yet|not|no|nor|neither|without|also|instead|therefore|thus|this|these|that|those|it|which|on\s+its\s+own|by\s+itself|for\s+example|in\s+contrast)\b/iu;
  const abbreviation=/(?:\b(?:p\.?\s*ej|ej|aprox|etc|dr|dra|sr|sra|ud|uds|vs|fig|núm|num|vol|mr|mrs|ms|prof|e\.?g|i\.?e)\.|\b\p{L}\.)$/iu;
  try{
    const boundaries=[...new Intl.Segmenter(locale,{granularity:'sentence'}).segment(block)].map(part=>part.index).slice(1);
    const result=[];let start=0;
    for(const boundary of boundaries){
      const before=block.slice(0,boundary).trimEnd(),after=block.slice(boundary).trimStart();
      if(!safe.has(boundary)||abbreviation.test(before)||(/\d[.,]$/u.test(before)&&/^\d/u.test(after)))continue;
      if(dependent.test(after.replace(/^["'«“‘([]+/u,'')))continue;
      if(words(block.slice(start,boundary))<50)continue;
      result.push(block.slice(start,boundary));start=boundary;
    }
    const tail=block.slice(start);
    if(result.length&&words(tail)<20)result[result.length-1]+=tail;
    else if(tail)result.push(tail);
    // Original slices retain every interior character, including trailing whitespace.
    return result.length&&result.join('')===block?result:authored;
  }catch{return authored;}
}

/** A report-owned entity is a neutral reading aid, never an automatically inferred takeaway. */
export function segmentsWithEntities(text:string, names:string[], limit=2) {
  const cap=Number.isFinite(limit)?Math.max(0,Math.floor(limit)):0;
  const unique=[...new Set((Array.isArray(names)?names:[]).filter(n=>typeof n==='string'&&n.trim()).map(n=>n.trim()))].sort((a,b)=>b.length-a.length);
  if(!unique.length||!cap)return [{text,emphasis:false}];
  const escaped=unique.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  // LDL must not match the middle of LDL-C, pre-LDL, LDL–C or a ratio identifier.
  const identifier='[\\p{L}\\p{M}\\p{N}_\\p{Dash_Punctuation}\\u2212/]';
  const pattern=new RegExp(`(?<!${identifier})(?:${escaped.join('|')})(?!${identifier})`,'giu');
  const parts:{text:string;emphasis:boolean}[]=[];let cursor=0,count=0;const seen=new Set();
  for(const match of text.matchAll(pattern)){
    if(count>=cap)break;
    const key=match[0].toLowerCase();if(seen.has(key))continue;
    if(match.index>cursor)parts.push({text:text.slice(cursor,match.index),emphasis:false});
    parts.push({text:match[0],emphasis:true});cursor=match.index+match[0].length;seen.add(key);count++;
  }
  if(cursor<text.length)parts.push({text:text.slice(cursor),emphasis:false});
  return parts.length?parts:[{text,emphasis:false}];
}
