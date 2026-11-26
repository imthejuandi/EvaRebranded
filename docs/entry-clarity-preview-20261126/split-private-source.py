import pathlib,subprocess,os,json
root=pathlib.Path('/workspace/sites/eva-entry-private-20261126/source')
def git(*args,**kwargs):return subprocess.check_output(['git',*args],cwd=root,**kwargs)
original=git('rev-parse','HEAD').decode().strip();original_tree=git('rev-parse','HEAD^{tree}').decode().strip()
entries=[]
for raw in git('ls-tree','-rz','HEAD').split(b'\0'):
 if not raw:continue
 head,name=raw.split(b'\t',1);mode,kind,sha=head.decode().split();file=name.decode();entries.append((mode,sha,file,(root/file).stat().st_size))
limit=40*2**20;groups=[]
for entry in sorted(entries,key=lambda x:(-x[3],x[2])):
 if entry[3]>limit:raise RuntimeError('Individual file exceeds batching budget')
 for group in groups:
  if group['size']+entry[3]<=limit:group['items'].append(entry);group['size']+=entry[3];break
 else:groups.append({'items':[entry],'size':entry[3]})
index=pathlib.Path('/tmp/eva-private-publication-index');index.unlink(missing_ok=True);env={**os.environ,'GIT_INDEX_FILE':str(index)}
git('read-tree','--empty',env=env);parent=None;receipts=[]
for i,group in enumerate(groups,1):
 raw=b''.join(f'{mode} {sha}\t{file}\0'.encode() for mode,sha,file,_ in group['items'])
 subprocess.run(['git','update-index','-z','--index-info'],cwd=root,env=env,input=raw,check=True)
 tree=git('write-tree',env=env).decode().strip();args=['commit-tree',tree]
 if parent:args+=['-p',parent]
 args+=['-m',f'Stage retained EVA private preview source part {i} of {len(groups)}']
 parent=git(*args).decode().strip();receipts.append({'part':i,'commit':parent,'added_files':len(group['items']),'uncompressed_bytes':group['size']})
assert git('rev-parse',parent+'^{tree}').decode().strip()==original_tree
subprocess.run(['git','branch','private-source-batches',parent],cwd=root,check=True)
subprocess.run(['git','switch','private-source-batches'],cwd=root,check=True)
receipt={'original_snapshot_commit':original,'original_tree':original_tree,'final_commit':parent,'identical_final_tree':True,'batches':receipts}
pathlib.Path('/workspace/eva-in-place-qa/entry-clarity-20261126/source-upload-batches.json').write_text(json.dumps(receipt,indent=2)+'\n')
index.unlink(missing_ok=True)
print('Created',len(groups),'fast-forward upload steps. Final source tree identical:',True,'Final commit:',parent)
