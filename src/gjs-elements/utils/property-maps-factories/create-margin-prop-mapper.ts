import { DataType } from "dilswer";
import type { ElementMargin, WidgetWithMargin } from "../apply-margin";
import { applyMargin } from "../apply-margin";
import type { PropMapper } from "../map-properties";

export type MarginProps = {
  margin?: ElementMargin;
};

export const MarginDataType = DataType.OneOf(
  DataType.Number,
  DataType.ArrayOf(DataType.Number)
);

export const createMarginPropMapper = (widget: WidgetWithMargin) => {
  return (mapper: PropMapper<"margin">) =>
    mapper.margin(MarginDataType, (v = 0) => {
      applyMargin(widget, v);
    });
};