import * as icons from 'lucide-react-native/icons';
import type { LucideProps } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React, { memo } from 'react';

export type IconName = keyof typeof icons;
type IconProps = LucideProps & { name: IconName; className?: string };

/**
 * `cssInterop` registers a component with NativeWind and returns a new wrapper, so it has
 * to run once per icon at module scope. Building it during render produced a fresh
 * component type whenever React discarded the memo, remounting the icon and leaving
 * css-interop to "upgrade" an already-mounted component.
 */
const interopCache = new Map<IconName, React.ComponentType<LucideProps & { className?: string }>>();

function getIcon(name: IconName) {
  const cached = interopCache.get(name);
  if (cached) {
    return cached;
  }

  const Base = icons[name] ?? icons.Image;
  const Interop = cssInterop(Base, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
        width: true,
        height: true,
      },
    },
  }) as React.ComponentType<LucideProps & { className?: string }>;

  interopCache.set(name, Interop);

  return Interop;
}

const Icon: React.FC<IconProps> = memo(({ name, className, ...rest }) => {
  const CustomIcon = getIcon(name);

  return <CustomIcon className={className} {...rest} />;
});

Icon.displayName = 'Icon';

export default Icon;
