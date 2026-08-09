import React from "react";
import Image from "next/image";

export interface WinnerProject {
  src: string;
  title: string;
  award: string;
  team: string;
  desc: string;
}

interface WinnerCardProps {
  project: WinnerProject;
}

export default function WinnerCard({ project }: WinnerCardProps) {
  return (
    <div className="past-winners__project-col">
      <div className="past-winners__card-box">
        <div className="past-winners__img-wrap">
          <Image
            src={project.src}
            alt={project.title}
            fill
            sizes="(max-width: 767px) 85vw, 36vw"
            className="past-winners__img"
          />
        </div>

        <span className="utility past-winners__award-tag">{project.award}</span>
        <h3 className="past-winners__project-title">{project.title}</h3>
        <p className="past-winners__team">{project.team}</p>
        <p className="body past-winners__desc">{project.desc}</p>
      </div>
    </div>
  );
}
