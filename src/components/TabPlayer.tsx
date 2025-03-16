"use client"

import { useEffect, useRef, useState } from "react";
import { AlphaTabApi, Settings, Color } from "@coderline/alphatab";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

type Props = {
    filename: string
}
export default function TabPlayer({ filename }: Props) {

    const elementRef = useRef<HTMLDivElement>(null);
    const [api, setApi] = useState<AlphaTabApi>();
    const { theme, systemTheme, forcedTheme, resolvedTheme } = useTheme();

    const colorMapping: {
        [key: string]: string
    } = {
        "dark": "#fff",
        "light": "#000",
        "system": "#888"
    }

    function getTabFontColor(): string {
        return colorMapping[theme]
    }

    useEffect(() => {
        console.log("theme=" + theme);
        console.log("forcedTheme=" + forcedTheme);
        console.log("systemTheme=" + systemTheme);
        console.log("resolvedTheme=" + resolvedTheme);
        const color = getTabFontColor();
        console.log("color=" + color);
        const api = new AlphaTabApi(elementRef.current!, {
            core: {
                file: '/uploads/exercises/' + filename,
                fontDirectory: '/alphatab/font/'
            },
            player: {
                enablePlayer: true,
                enableCursor: true,
                enableUserInteraction: true,
                soundFont: '/alphatab/soundfont/sonivox.sf2',
                enableElementHighlighting: true,
            },
            display: {
                resources: {
                    staffLineColor: color,
                    barSeparatorColor: color,
                    mainGlyphColor: color,
                    secondaryGlyphColor: color,
                    scoreInfoColor: color,
                    barNumberColor: color,
                },
            }
        });

        setApi(api);

        return () => {
            console.log('destroy', elementRef, api);
            api.destroy();
        }
    }, []);

    function playPause() {
        api?.playPause();
    }

    return (
        <>
            <main>
                <Button onClick={() => playPause()}>Play/Pause</Button>
                <div className="shadow-sm mt-4 rounded-lg max-h-80 overflow-scroll">
                    <div className="m-4" ref={elementRef}></div>
                </div>
            </main>
        </>
    );

}