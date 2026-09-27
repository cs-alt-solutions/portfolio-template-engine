/* src/components/portfolio/content-engine/index.tsx */
'use client';

import React from 'react';
import { ContentLayoutProps } from './types';

import ClassicFlow from './layouts/ClassicFlow';
import BentoGridFlow from './layouts/BentoGridFlow';
import StickyScrollFlow from './layouts/StickyScrollFlow';
import EditorialHoverFlow from './layouts/EditorialHoverFlow';
import AccordionFlow from './layouts/AccordionFlow';
import MenuFlow from './layouts/MenuFlow'; // 🚀 RESTORED IMPORT

interface ContentEngineProps extends ContentLayoutProps {
  layout: string;
}

export default function ContentEngine(props: ContentEngineProps) {
  const FlowRegistry: Record<string, React.ComponentType<ContentEngineProps>> = {
    bento: BentoGridFlow,
    sticky: StickyScrollFlow,
    editorial: EditorialHoverFlow,
    accordion: AccordionFlow,
    menu: MenuFlow, // 🚀 RESTORED REGISTRY
    classic: ClassicFlow,
  };

  const SelectedFlow = FlowRegistry[props.layout] || ClassicFlow;

  return <SelectedFlow {...props} />;
}