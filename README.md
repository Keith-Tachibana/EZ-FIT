# EZ-FIT
This full-stack web application syncs a user's FitBit data in order to generate workout suggestions using machine learning, and was developed as part of the requirements for UCI's Master of Computer Science (MCS) program's CS 297P course: Capstone Design Project.
## Developed By
Ashwin Balachandran, Harry Pham, and Keith Tachibana
## Technologies Used
|         Dependency       |  Version  |
|--------------------------|----------:|
| @Material-UI/Core        |   4.5.1   | 
| @Material-UI/Icons       |   4.5.1   |
| Axios                    |  0.19.0   |
| Bcrypt                   |   3.0.6   |
| Body-Parser              |  1.19.0   |
| CSV                      |   5.3.0   |
| Dotenv                   |   8.2.0   |
| Express                  |   4.17.1  |
| Express-Naked-Redirect   |   0.1.4   |
| Express-SSLify           |   1.2.0   |
| Express-Validator        |   6.2.0   |
| Flask                    |   1.1.1   |
| Heroku-CLI               |   7.38.2  |
| JSON-Web-Token           |   8.5.1   |
| Knuth-Shuffle            |   1.0.8   |
| Mailgun-JS               |   0.22.0  |
| Moment                   |   2.24.0  |
| MongoDB                  |   4.0.3   |
| Mongoose                 |   5.7.5   |
| Morgan                   |   1.9.1   |
| React                    |  16.10.2  |
| React-DOM                |  16.10.2  |
| React-Router-DOM         |   5.1.2   |
| Serve-Favicon            |   2.5.0   |
## Live Demo
Try the application live at [our website](https://ezfit.rocks/)
## Features
- Utilizes the FitBit API to sync a user's fitness data to display on the Material-UI themed dashboard
- Anyone can sign up for an account which sends the user an auto-generated welcome e-mail
- User can instantly switch themes between light or dark mode
- Features a one-of-a-kind injury tracking system not found on other fitness tracking applications
- Gives a 7-day schedule of workout suggestions generated using k-means clustering and decision trees
- Machine learning algorithmns look at 4 factors: body mass index (BMI), body fat, age, and injuries
## Preview
![EZ-FIT Preview](preview.gif "EZ-FIT Preview")
## Development
#### System Requirements
|  Requirement  |      Version     |
|---------------|-----------------:|
| Heroku        |    7 or higher   |
| MongoDB       |    4 or higher   |
| Node.js       |   10 or higher   |
| NPM           |    6 or higher   |
