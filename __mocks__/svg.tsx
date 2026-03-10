import type { SVGProps } from 'react';
import React from 'react';

export default function SvgrMock(props: SVGProps<SVGSVGElement>) {
  return <svg data-testid="svg-mock" {...props} />;
}
