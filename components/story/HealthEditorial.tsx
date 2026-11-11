'use client';
import {HomeUnderstanding} from '@/components/site/RestoredContent';
import {HealthStorySection} from './HealthStorySection';
import {BiologicalAgeSection} from './BiologicalAgeSection';
import { LifestylePassage } from './LifestylePassage';
import { MethodJourney } from './MethodJourney';
import {StoryScenePassage} from './StoryScenePassage';
import {FounderStory} from './FounderStory';
export function HealthEditorial({ calm = false }: {
    calm?: boolean;
}) {
    return <>
 <HealthStorySection calm={calm}/>
 <HomeUnderstanding calm={calm}/>
 <BiologicalAgeSection calm={calm}/>
 <MethodJourney calm={calm}/>
 <StoryScenePassage kind="life" calm={calm}/>
 <LifestylePassage calm={calm}/>
 <FounderStory/>
 </>;
}
