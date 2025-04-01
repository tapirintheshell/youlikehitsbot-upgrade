#### (English)
# YouLikeHits Bot Upgrade

- **Version: 0.5.1t** 

This project is a modified version of the original <a href="https://github.com/gekkedev/youlikehitsbot" target="_blank">YouLikeHits Bot</a> by **gekkedev**. It has been tailored exclusively for handling YouTube videos in the YouLikeHits workflow.

## Features

- **YouTube-Specific Modifications:**  
  The modifications in this project are designed specifically for YouTube videos.

- **Automated Video Transition:**  
  After a countdown period, the script automatically transitions to the next video.

- **New Window Handling:**  
  Videos are opened in a new window. The countdown duration captured from YouLikeHits is transferred to the YouTube window, and an additional 10 seconds is added as a precaution. This forms the "window closing timeout."

- **Auto-Close Mechanism:**  
  Once the countdown ends, the YouTube window is automatically closed, ensuring that unnecessary windows do not remain open.

- **Independent Operation:**  
  Each newly opened YouTube window operates independently, with its own countdown time (as received from YouLikeHits).

## Additional Requirement:
  For proper functioning, this project requires the <a href="https://greasyfork.org/en/scripts/433051-trusted-types-helper" target="_blank">Trusted Types Helper</a> script (an official Tampermonkey script).

## Acknowledgements

A huge thank you to **gekkedev** for creating the original <a href="https://github.com/gekkedev/youlikehitsbot" target="_blank">YouLikeHits Bot</a>, which served as the basis for this project. Your work has been invaluable in developing this tailored solution for YouLikeHits content management.


___


#### (Latin)
# YouLikeHits Bot Renovatio

**Versio: 0.5.1t**  

Hoc opus est *versio modificata* automati originalis <a href="https://github.com/gekkedev/youlikehitsbot" target="_blank">YouLikeHits Bot</a>, ab **gekkedev** creati. Ad usum *exclusivum* spectaculorum YouTube in via operis YouLikeHits accommodatum est.  

## **Facultates**  

1. **Mutationes Speciales ad YouTube**  
   Omnes emendationes ad spectacula YouTube diriguntur.  

2. **Transitus Automaticus Spectaculorum**  
   Post finem temporis numerati, automaton ad proximum spectaculum sine interventu hominis transit.  

3. **Administratio Fenestrarum Novarum**  
   - Spectacula in *fenestra nova* aperiuntur.  
   - Tempus numerati a YouLikeHits acceptum **ad fenestram YouTube transfertur**, cum additis **X secundis** pro cautione (hoc vocatur *tempus claudendi fenestram*).  

4. **Mechanismus Clausurae Automaticae**  
   Finito tempore numerati, **fenestra YouTube clauditur**, ne fenestrae supervacuae maneant.  

5. **Operatio Independens**  
   Quaelibet fenestra YouTube **suo tempore numerati** (ex YouLikeHits accepto) regitur, sine perturbatione aliarum.  



## **Requiritur**  
   Ut hoc automaton recte operetur, necesse est habere <a href="https://greasyfork.org/en/scripts/433051-trusted-types-helper" target="_blank">Trusted Types Helper</a> (scriptum officiale Tampermonkey).  



## **Grates**  
   **Grates maximas** agimus **gekkedev** pro creatione automatis originalis <a href="https://github.com/gekkedev/youlikehitsbot" target="_blank">YouLikeHits Bot</a>, quod fundamentum huius operis fuit. Opus tuum *incomparabile* ad hanc solutionem pro administratione YouLikeHits perficiendam fuit.  
