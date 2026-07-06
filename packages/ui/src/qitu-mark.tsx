import { useId, type SVGProps } from "react";
import { cn } from "./utils";

export type QituMarkProps = SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

export function QituMark({ className, title, ...props }: QituMarkProps) {
  const titleId = useId();

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      className={cn("qitu-mark", className)}
      focusable="false"
      role={title ? "img" : undefined}
      viewBox="0 0 256 256"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        className="qitu-mark-form"
        d="M68 126L108 58C114 47 124 41 136 41H171C178 41 182 48 178 54L142 106C136 118 127 125 114 130C99 136 84 141 69 141C65 141 63 137 65 133L68 126Z"
      />
      <path
        className="qitu-mark-form"
        d="M68 151C88 151 105 159 119 176L148 213C154 221 148 231 138 231H107C98 231 91 227 86 220L58 178C52 169 48 160 45 154C44 152 46 151 49 151H68Z"
      />
      <path
        className="qitu-mark-form"
        d="M151 145C160 140 166 132 171 122C174 117 178 114 184 111L188 103C196 98 205 105 200 114L161 182L132 150C128 145 135 143 151 145Z"
      />
      <circle className="qitu-mark-accent" cx="153" cy="124" r="14" />
    </svg>
  );
}
