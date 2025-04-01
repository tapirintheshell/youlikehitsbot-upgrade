# YouLikeHits Bot Upgrade

- **Version: 0.5.1t** 

This project is a modified version of the original [YouLikeHits Bot](https://github.com/gekkedev/youlikehitsbot) by **gekkedev**. It has been tailored exclusively for handling YouTube videos in the YouLikeHits workflow.

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
  For proper functioning, this project requires the [Trusted Types Helper](https://greasyfork.org/en/scripts/433051-trusted-types-helper) script (an official Tampermonkey script).

## Acknowledgements

A huge thank you to **gekkedev** for creating the original [YouLikeHits Bot](https://github.com/gekkedev/youlikehitsbot), which served as the basis for this project. Your work has been invaluable in developing this tailored solution for YouLikeHits content management.
