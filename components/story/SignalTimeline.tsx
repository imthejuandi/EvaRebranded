'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { bodySignalLabels } from '@/lib/body-signal';
import { bodyPlaybackProgress } from '@/lib/body-signal-playback';
export type SignalTimelineHandle = {
    setFrame: (frame: number) => void;
};
type Props = {
    chapter: number;
    initialFrame?: number;
    onSelect: (chapter: number) => void;
};
export const SignalTimeline = forwardRef<SignalTimelineHandle, Props>(function SignalTimeline({ chapter, initialFrame = 0, onSelect }, ref) {
    const __site = useSiteLanguage();
    const fills = useRef<(HTMLSpanElement | null)[]>([]);
    useImperativeHandle(ref, () => ({
        setFrame(frame) {
            bodyPlaybackProgress(frame).forEach((progress, index) => {
                const fill = fills.current[index];
                const transform = `scaleX(${progress})`;
                if (fill && fill.style.transform !== transform)
                    fill.style.transform = transform;
            });
        },
    }), []);
    const progress = bodyPlaybackProgress(initialFrame);
    return <nav className="signal-controls signal-timeline" aria-label={__site.t("Etapas de la se\u00F1al")}>
  {__site.t(bodySignalLabels.map((label, index) => <button type="button" key={label} aria-current={chapter === index ? 'step' : undefined} onClick={() => onSelect(index)}>
   <span className="signal-timeline-track" aria-hidden="true"><span className="signal-timeline-fill" ref={element => { fills.current[index] = element; }} style={{ transform: `scaleX(${progress[index]})` }}/></span>
   <span className="signal-timeline-caption"><span className="signal-timeline-number" aria-hidden="true">{__site.t("0")}{__site.t(index + 1)}</span><span className="signal-timeline-label">{__site.t(label)}</span></span>
  </button>))}
 </nav>;
});
