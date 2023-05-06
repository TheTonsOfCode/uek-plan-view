export const STYLE_REPLACE = `<link rel="stylesheet" type="text/css" href="planzajec.css">`;

export const STYLE = `
<style>
    @media screen {body { width: 90%; margin: 5mm auto; }}
    @media print {body { width: 100%; margin: auto; }}
    
    body {font-family: Arial, Helvetica, sans-serif; text-align: center; font-size: 11pt; }
    
    a:link { text-decoration: none; color: black }
    a:visited { text-decoration: none; color: black }
    a:hover {text-decoration: underline; color: green;}
    
    
    /* logo UEK oraz tytuł, czyli PLAN ZAJĘĆ */
    .naglowek {margin-top: 1cm; margin-bottom: 1cm;}
    .logo { display: inline; margin: auto; margin-bottom: 5mm;}
    .planzajec {display: inline; vertical-align: 25%; font-size: 2.2em; color: darkseagreen; font-weight: bold; margin-left: 5mm; }
    .planzajec a:link { text-decoration: none; color: #004926 }
    .planzajec a:visited { text-decoration: none; color: #004926 }
    .planzajec a:hover {text-decoration: none; color: #004926;}
    
    /* nazwa nad kreskš */
    .grupa {margin: auto; margin-bottom: 0.3em; text-align: left; font-size: 1.3em; color: darkseagreen; font-weight: bold; }
    
    /* eWizytowka - usuń ramkę i obniż ikony eWizytówek */
    a img {border: 0; vertical-align: -15%}
    
    /* lista kategorii do wyboru - pierwsze litery nazwisk, kategorie grup oraz sal */
    .kategorie { margin: auto; margin-top: 1mm ; margin-bottom: 1.5cm; padding-top: 2mm;}
    .kategorie { border-top-width: 1.5mm; border-top-style: solid; border-top-color: darkseagreen; }
    .kategorie a { margin: 0 2mm;} /* większe odstępy pomiędzy nazwami kategorii do wyboru */
    
    /* nazwy kategorii tj. nazwiska, nazwy grup lub sal, w czterech kolumnach */
    .kolumny { margin: auto; text-align: center; border-top-width: 1.5mm; border-top-style: solid; border-top-color: darkseagreen; }
    .kolumna { float:left; width: 22%; text-align: left; margin: 1%; line-height: 1.7em; }
    
    /* wykaz zajęć grupy, nauczyciela lub sali w formie tabeli */
    table { margin: auto; width: 100%; border-collapse: collapse; font-size: 8pt }
    th { background-color: darkseagreen; border-color: darkseagreen; border-style: solid; border-width: 1pt; }
    tr.czerwony {color: red } /* zajęcia przeniesione */
    td { background-color: azure; text-align: center; border-color: darkseagreen; border-style: solid; border-width: 1pt; }
    td.uwagi {color: green; font-style: italic; }
    td.termin {width: 6.5em}
    td.dzien {width: 9.5em}
    
    /* dane dotyczšce MBJ - email oraz www */
    .MBJ { clear: both; margin-top: 1cm; color: darkseagreen; font-size: 8pt; text-align: right; font-style: italic; }
    .MBJ a:link { text-decoration: none; color: darkseagreen }
    .MBJ a:visited { text-decoration: none; color: darkseagreen }
    .MBJ a:hover {text-decoration: none; color: darkseagreen;}
    
    
    
    /*tr.meine:not(.czerwony) td { color: white };*/
    tr.meine td { background-color: #fccfff !important; font-weight: bold; }
    /*tr.meine:not(.czerwony) td { color: white; }*/
    tr.meine.thisweek td { background-color: #d1ffcf !important; font-weight: bold; }
    tr.meine.nextweek td { background-color: #cfd9ff !important; font-weight: bold; }
</style>
`;

export function replaceStyle(html: any) {
    return html.replace(STYLE_REPLACE, STYLE);
}