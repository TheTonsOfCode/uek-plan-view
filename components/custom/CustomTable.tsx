import React, {useEffect, useState} from 'react';
import {getPolishDayName, hoursSpaceInPolishFormat, Lesson, parseStudyWeeks, StudyWeek} from "@/components/custom/type";
import clsx from "clsx";
import {FaBuilding, FaExclamationTriangle, FaUser} from "react-icons/fa";

interface Props {
    webpageFinalized: string;
}

export const CustomTable = (props: Props) => {
    const {webpageFinalized} = props;

    const [showPast, setShowPast] = useState<boolean>(false);
    const [studyWeeks, setStudyWeeks] = useState<StudyWeek[]>([]);

    useEffect(() => {
        setStudyWeeks(parseStudyWeeks(webpageFinalized))
    }, [webpageFinalized]);

    function Type({t}: {t: string}) {
        return <div className={clsx(
            'flex justify-between m-1 p-1 text-xs border border-dashed',
            t.includes('wykład') && 'bg-purple-400 text-white',
            t.includes('lektorat') && 'bg-lime-600 text-white',
            t.includes('ćwiczenia') && 'bg-orange-400 text-white',
            t.includes('egzamin') && 'bg-red-600 text-white py-2 px-2 uppercase',
        )}>
            {t}
        </div>
    }

    function StudyLesson({lesson, prevLesson}: { lesson: Lesson, prevLesson: Lesson | undefined }) {

        const spaceTime = !prevLesson ? undefined : hoursSpaceInPolishFormat(prevLesson.hourEnd, lesson.hourStart);

        return (<>
            {spaceTime && <div className='bg-blue-200 text-xs p-1'>
                przerwa: {spaceTime}
            </div>}
            <div className={clsx('border-2 border-gray-500 bg-white', lesson.isRed && 'text-red-500 bg-red-50')}>
                <div className='flex flex-col sm:flex-row items-center gap-2 border-b'>
                    <div className='flex items-center gap-1'>
                        <div className='text-xs h-6 px-1 bg-gray-100 flex items-center text-gray-500'>{lesson.hourSpan}g.</div>
                        <div className='text-gray-500'>{lesson.hourStart} - {lesson.hourEnd}</div>
                    </div>
                    <div className='text-xs font-semibold pr-2'>
                        {lesson.subject}
                    </div>
                </div>
                <div className='flex justify-between p-1 gap-2'>
                    {lesson.room && <div className='flex items-center text-xs p-2 gap-2 border'>
                        <FaBuilding/>
                        {lesson.room}
                    </div>}
                    {lesson.teacherLink && <div className='inline-block'>
                        <a href={lesson.teacherLink} target="_blank">
                            <div className='flex items-center text-xs p-2 gap-2 border'>
                                <FaUser className='text-lg'/>
                                {lesson.teacherName}
                            </div>
                        </a>
                    </div>}
                </div>

                <Type t={lesson.type}/>

                {lesson.caution && <div className='flex items-center justify-center gap-1 bg-yellow-50 text-xs text-yellow-600 p-1'>
                    <FaExclamationTriangle/>
                    {lesson.caution}
                </div>}
            </div>
        </>);
    }

    function StudyDay({date, lessons}: { date: string, lessons: Lesson[] }) {

        return <div>
            <div className='border'>
                <div className='uppercase font-bold px-4 py-2 bg-gray-200 flex gap-2 flex-wrap items-center'>
                    {getPolishDayName(date)}
                    <div className='text-xs font-normal'>{date}</div>
                </div>
                <div className='p-1 flex flex-col gap-2 bg-gray-50'>
                    {lessons.map((l, li) => <StudyLesson lesson={l} key={li} prevLesson={li > 0 ? lessons[li - 1] : undefined} />)}
                </div>
            </div>
        </div>
    }

    function StudyWeek({w}: { w: StudyWeek }) {
        if (w.past && !showPast) return null;

        return <div className='flex flex-col gap-2'>
            <div className={clsx(
                'border w-full p-2 flex flex-col sm:flex-row items-center gap-4',
                w.past ? 'bg-gray-500' : !!Object.keys(w.datesLessons).length ? 'bg-green-200' : 'bg-blue-200'
            )}>
                <div className='text-xs font-mono'>
                    {w.startDate} - {w.endDate}
                </div>
                <div className='font-bold'>
                    {w.name}
                </div>
            </div>
            <div className='flex gap-4 flex-wrap'>
                {Object.keys(w.datesLessons).map(date => <StudyDay date={date} lessons={w.datesLessons[date]} key={date}/>)}
                {!Object.keys(w.datesLessons).length && <div className='text-xs mx-8 my-14 text-gray-500'>
                    Brak zajęć w tym tygodniu
                </div>}
            </div>
        </div>
    }

    return <div className='w-full px-10 flex flex-col gap-4'>
        {!showPast && <div className='border p-2 flex justify-center cursor-pointer font-semibold bg-gray-50' onClick={() => setShowPast(true)}>
            Pokaż przeszłe tygodnie
        </div>}
        {studyWeeks?.map((w, wi) => <StudyWeek w={w} key={w.name + wi + w.startDate + w.endDate}/>)}
    </div>;
}