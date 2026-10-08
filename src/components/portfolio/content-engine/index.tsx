// src/components/portfolio/content-engine/index.tsx
'use client';

import React from 'react';
import { ContentLayoutProps } from './types';

import ClassicFlow from './layouts/ClassicFlow';
import BentoGridFlow from './layouts/BentoGridFlow';
import StickyScrollFlow from './layouts/StickyScrollFlow';
import EditorialHoverFlow from './layouts/EditorialHoverFlow';
import AccordionFlow from './layouts/AccordionFlow';
import MenuFlow from './layouts/MenuFlow';
import LookbookFlow from './layouts/LookbookFlow'; // 🚀 ADDED NEW LOOKBOOK IMPORT

interface ContentEngineProps extends ContentLayoutProps {
  layout: string;
  orderingUrl?: string;
}

export default function ContentEngine(props: ContentEngineProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FlowRegistry: Record<string, React.ComponentType<any>> = {
    bento: BentoGridFlow,
    sticky: StickyScrollFlow,
    editorial: EditorialHoverFlow,
    accordion: AccordionFlow,
    menu: MenuFlow,
    lookbook: LookbookFlow, // 🚀 ADDED TO REGISTRY
    classic: ClassicFlow,
  };

  const SelectedFlow = FlowRegistry[props.layout] || ClassicFlow;

  return <SelectedFlow {...props} />;
}