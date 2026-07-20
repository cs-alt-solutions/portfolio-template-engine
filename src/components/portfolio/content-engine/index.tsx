'use client';

import React from 'react';
import { ContentLayoutProps } from './types';
import ClassicFlow from './layouts/ClassicFlow';
import BentoGridFlow from './layouts/BentoGridFlow';
import StickyScrollFlow from './layouts/StickyScrollFlow';
import EditorialHoverFlow from './layouts/EditorialHoverFlow';
import AccordionFlow from './layouts/AccordionFlow';

interface ContentEngineProps extends ContentLayoutProps {
  layout: string;
}

export default function ContentEngine(props: ContentEngineProps) {
  // 🚨 FIXED: Replaced 'any' with 'ContentEngineProps' to satisfy strict typing
  const FlowRegistry: Record<string, React.ComponentType<ContentEngineProps>> = {
    bento: BentoGridFlow,
    sticky: StickyScrollFlow,
    editorial: EditorialHoverFlow,
    accordion: AccordionFlow,
    classic: ClassicFlow,
  };

  const SelectedFlow = FlowRegistry[props.layout] || ClassicFlow;

  return <SelectedFlow {...props} />;
}