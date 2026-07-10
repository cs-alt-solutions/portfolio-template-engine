// src/components/portfolio/content-engine/index.tsx
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
  switch (props.layout) {
    case 'bento':
      return <BentoGridFlow {...props} />;
    case 'sticky':
      return <StickyScrollFlow {...props} />;
    case 'editorial':
      return <EditorialHoverFlow {...props} />;
    case 'accordion':
      return <AccordionFlow {...props} />;
    case 'classic':
    default:
      return <ClassicFlow {...props} />;
  }
}