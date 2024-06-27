import { Switch } from "@radix-ui/themes";
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <label className="pr-5">Areas</label>
        <Switch
          checked={value === SwitchValue.Areas ? true : false}
          onCheckedChange={() => onChange()}
        ></Switch>
        <label className="pl-5">Artefacts</label>
      </div>
    );
  },
);
ViewSwitch.displayName = "ViewSwitch";

export { ViewSwitch };
