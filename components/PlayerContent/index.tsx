'use client';

import { PlayerContentProps } from "@/types/components";
import { MediaItem } from "../MediaItem";
import { LikeButton } from "../LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { Slider } from "../Slider";
import usePlayer from "@/hooks/usePlayer";
import { useState } from "react";
import useSound from "use-sound";
import { useEffect } from "react";

const PlayerContent = ({ song, songUrl }: PlayerContentProps) => {
    const player = usePlayer();
    const [volume, setVolume] = useState<number>(1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayPrevious = () => {
        if (player.ids.length <= 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };

    const onPlayNext = () => {
        if (player.ids.length <= 0) return;

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    };

    const [play, { pause, sound }] = useSound(songUrl, 
        {
            volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3'],
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.stop();
        };
    }, [sound]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            <div className="flex md:hidden items-center justify-end col-auto w-full">
                <div 
                    className="size-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                    onClick={handlePlay}
                >
                    <Icon className="text-black" size={30} />
                </div>
            </div>

            <div className="hidden md:flex items-center justify-center gap-x-6 size-full max-w-[722px]">
                <AiFillStepBackward 
                    className="text-neutral-400 cursor-pointer hover:text-white transition" 
                    size={30}
                    onClick={onPlayPrevious}
                />
                <div 
                    className="flex items-center justify-center size-10 rounded-full bg-white p-1 cursor-pointer"
                    onClick={handlePlay}
                >
                    <Icon className="text-black" size={30} />
                </div>
                <AiFillStepForward
                    className="text-neutral-400 cursor-pointer hover:text-white transition" 
                    size={30}
                    onClick={onPlayNext}
                />
            </div>

            <div className="hidden md:flex items-center justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon 
                        className="cursor-pointer"
                        size={34}
                        onClick={toggleMute}
                    />
                    <Slider
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    );
};

export { PlayerContent };