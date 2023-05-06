export interface StudyWeek {
    startDate: string;
    endDate: string;
    name: string;

    past: boolean;

    datesLessons: any
}

export interface Lesson {
    date: string;
    hourStart: string;
    hourEnd: string;
    hourSpan: string;
    subject: string;
    subjectLink: string;
    type: string;
    teacherName: string;
    teacherLink: string;
    isRed: boolean;
    caution: string;
    room: string;
}

export function getPolishDayName(dateString) {
    const daysOfWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

export function parseStudyWeeks(data: string): StudyWeek[] {
    function isValidDate(dateString: string): boolean {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(dateString);
    }


    const modifyContainer = document.getElementById('modify-canvas');

    if (!modifyContainer) return [];

    modifyContainer.innerHTML = data;

    const doc = new DOMParser().parseFromString(data, "text/html");
    const table: any = doc.getElementById('plan');
    const rows = table?.rows; //doc.querySelectorAll("tbody tr");
    const studyWeeks: StudyWeek[] = [];

    if (!rows) return studyWeeks;

    const now = new Date();
    const {startDate: nowWeekStartDate } = getWeekSpanDates(now);
    now.setDate(now.getDate() + 7);
    const {startDate: nextWeekStartDate } = getWeekSpanDates(now);

    let currentStudyWeek: StudyWeek | undefined;

    for (const row of rows) {
        const cols = row.querySelectorAll("td");
        const classNames = row.className.split(" ");

        if (!classNames.includes("meine")) continue;

        if (cols.length < 1) continue;

        const lessonDate = cols[0].textContent.trim();

        if (!isValidDate(lessonDate)) continue;

        const {
            startDate,
            endDate
        } = getWeekSpanDates(new Date(lessonDate))

        if (!currentStudyWeek || currentStudyWeek.startDate != startDate) {
            if (studyWeeks.length > 0) {
                const chkDate = new Date(lessonDate);
                const swFrees = [];
                while(true) {
                    chkDate.setDate(chkDate.getDate() - 7);
                    const {
                        startDate: csd,
                        endDate: ced
                    } = getWeekSpanDates(new Date(chkDate))
                    if (studyWeeks.find(sw => sw.startDate === csd)) {
                        break;
                    }
                    let name = 'Wolny tydzień';
                    if (csd === nowWeekStartDate) {
                        name += ' [Ten tydzień]';
                    }
                    if (csd === nextWeekStartDate) {
                        name += ' [Następny tydzień]';
                    }
                    currentStudyWeek = {startDate: csd, endDate: ced, name, datesLessons: new Map(), past: new Date(csd) < new Date(nowWeekStartDate)};
                    swFrees.push(currentStudyWeek);
                }
                swFrees.reverse();
                studyWeeks.push(...swFrees);
            }

            // Start of a new study week
            let name = `Tydzień (${studyWeeks.length + 1})`;
            if (startDate === nowWeekStartDate) {
                name += ' [Ten tydzień]';
            }
            if (startDate === nextWeekStartDate) {
                name += ' [Następny tydzień]';
            }
            console.log(new Date(startDate) < new Date(nowWeekStartDate));
            currentStudyWeek = {startDate, endDate, name, datesLessons: new Map(), past: new Date(startDate) < new Date(nowWeekStartDate) };
            studyWeeks.push(currentStudyWeek);
        }

        // Add lesson to current study week
        // const dayName = getPolishDayName(lessonDate);
        const hourStart = cols[1].textContent.split(" ")[1];
        const hourEnd = cols[1].textContent.split(" ")[3];
        const hourSpan = cols[1].textContent.match(/\((\d+)g\.\)/)?.[1] ?? "";
        const subject = cols[2].textContent.trim();
        const subjectLink = cols[5].querySelector("a")?.href ?? "";
        const type = cols[3].textContent.trim();
        const teacherName = cols[4].textContent.replace('👨‍🏫', '').trim();
        const teacherLink = cols[4].querySelector("a")?.href ?? "";
        const isRed = classNames.includes("czerwony");
        const caution = row.nextElementSibling?.querySelector(".uwagi")?.textContent ?? "";
        const room = cols[5].textContent.trim();

        const lesson: Lesson = {
            date: lessonDate,
            // dayName,
            hourStart,
            hourEnd,
            hourSpan,
            subject,
            subjectLink,
            type,
            teacherName,
            teacherLink,
            isRed,
            caution,
            room,
        };

        const lessons = currentStudyWeek.datesLessons[lessonDate] || [];

        lessons.push(lesson);

        currentStudyWeek.datesLessons[lessonDate] = lessons//.set(lessonDate, lessons);
    }

    modifyContainer.innerHTML = '';

    return studyWeeks;
}

function getWeekSpanDates(date: Date): {
    startDate: string,
    endDate: string
} {
    date.setDate(date.getDate() - 1);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const str = date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
        const s = str.split('/');
        return s[2] + '-' + s[0].padStart(2, '0') + '-' + s[1].padStart(2, '0');
    }

    const dayOfWeek = date.getDay(); // get day of week (0-6)

    const startDateDate = new Date(date.getTime() - (dayOfWeek * 24 * 60 * 60 * 1000));
    const endDateDate = new Date(startDateDate.getTime() + (6 * 24 * 60 * 60 * 1000));
    startDateDate.setDate(startDateDate.getDate() + 1);
    endDateDate.setDate(endDateDate.getDate() + 1);

    const startDate = formatDate(startDateDate);
    const endDate = formatDate(endDateDate);

    return {
        startDate,
        endDate
    }
}

export function hoursSpaceInPolishFormat(timeA, timeB) {
    const [hoursA, minutesA] = timeA.split(':').map(Number);
    const [hoursB, minutesB] = timeB.split(':').map(Number);

    const totalMinutesA = hoursA * 60 + minutesA;
    const totalMinutesB = hoursB * 60 + minutesB;

    const diffMinutes = totalMinutesB - totalMinutesA;

    if (diffMinutes < 0) {
        return undefined;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const result = [];

    if (hours > 0) {
        result.push(`${hours} godzin${hours == 1 ? 'a': 'y'}`);
    }

    if (minutes > 0) {
        result.push(`${minutes} minut${minutes == 1 ? 'a': minutes < 5 ? 'y' : ''}`);
    }

    return result.join(' ');
}
