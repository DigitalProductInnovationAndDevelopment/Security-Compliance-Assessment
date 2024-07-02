import React from "react";

export enum SwitchValue {
  Artefacts,
  Areas,
}

export interface SwitchProps {
  value?: SwitchValue.Artefacts | SwitchValue.Areas;
  onChange: () => void;
}

const ViewSwitch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ value = SwitchValue.Areas, onChange }) => {
    return (
      <div className="flex items-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            checked={value === SwitchValue.Artefacts ? true : false}
            onChange={() => onChange()}
            className="peer sr-only"
          />
          <div className="after: peer flex h-8 items-center gap-8 rounded-full bg-white px-4 text-sm after:absolute after:left-1 after:h-6 after:w-20 after:rounded-full after:bg-black/10 after:transition-all after:content-[''] peer-checked:bg-white peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700">
            <span className="pl-2 text-accent-foreground">Areas</span>
            <span className="text-accent-foreground">Artefacts</span>
          </div>
        </label>
      </div>
    );
  },
);
ViewSwitch.displayName = "ViewSwitch";

export { ViewSwitch };
