"use client"

import { useEffect, useRef, useState } from "react";
import { AlphaTabApi } from "@coderline/alphatab";
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
        "dark": "#eee",
        "light": "#111",
        "system": "#888"
    }

    function getTabFontColor(): string {
        return colorMapping[theme ? theme : ""]
    }

    useEffect(() => {
        console.log("theme=" + theme);
        console.log("forcedTheme=" + forcedTheme);
        console.log("systemTheme=" + systemTheme);
        console.log("resolvedTheme=" + resolvedTheme);
        const tabFontColor = getTabFontColor();
        const api = new AlphaTabApi(elementRef.current!, {
            core: {
                file: '/uploads/exercises/' + filename,
                fontDirectory: '/alphatab/font/'
            },
            player: {
                enablePlayer: true,
                enableCursor: true,
                enableAnimatedBeatCursor: true,
                enableElementHighlighting: true,
                enableUserInteraction: true,
                scrollMode: 1,
                soundFont: '/alphatab/soundfont/sonivox.sf2',
            },
            display: {
                resources: {
                    staffLineColor: tabFontColor,
                    barSeparatorColor: tabFontColor,
                    mainGlyphColor: tabFontColor,
                    secondaryGlyphColor: tabFontColor,
                    scoreInfoColor: tabFontColor,
                    barNumberColor: tabFontColor,
                },
            }
        });


        api.metronomeVolume = 1
        api.countInVolume = 1
        api.isLooping = true

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
                <div className="shadow-sm mt-4 rounded-lg">
                    <div className="m-4" ref={elementRef}></div>
                </div>
            </main>
        </>
    );

}