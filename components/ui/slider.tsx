"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="w-full space-y-3">
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <label className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {label}
                    </label>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                        {valueDisplay}
                    </span>
                </div>
                <input
                    type="range"
                    ref={ref}
                    className={cn(
                        "w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
Slider.displayName = "Slider";

export { Slider };
