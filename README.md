# 🏏 Sandhu Cricket (Web Edition)

A professional street cricket scorer application built with **Next.js**, ported from the original React Native mobile app. This web application allows users to score gully cricket matches with flexible rules, detailed statistics, and a "Vibe Check" UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Why This Scorer is Different?

Most cricket apps assume you are playing a professional match with 11 players and standard rules. Sandhu Cricket assumes you are playing in a parking lot, a park, or a street where rules change, arguments happen, and teams can be any size.

### 1. ♾️ Unlimited Player Flexibility
* **No Hard 11-Player Cap:** Street teams rarely have exactly 11 players. Whether you are playing **3 vs 3** or **15 vs 15**, the app handles it.
* **"Last Man Standing" Ready:** The scoring engine doesn't force an "All Out" status automatically unless you say so. You can keep playing until the very last run is chased.

### 2. 🧠 Advanced "Extras" Logic
Standard apps struggle when multiple things happen at once. We handle the complex math automatically:
* **Wide + Runs:** If the batsman runs 2 on a Wide ball, just click `WD` -> `+2`. The app calculates: **1 Wide Extra + 2 Runs = 3 Total Runs**.
* **No Ball + Wicket:** Did a player get Run Out on a No Ball? The app correctly records the runs, adds the extra, counts the wicket, but *doesn't* count the ball as legal.
* **Run Out + Runs:** If a batsman completes a run but gets out attempting the second, you can record **"1 Run + Wicket"**.

### 3. 🕹️ Total Manual Override (The "Innings" Logic)
* **No Auto-Kill:** In many apps, once the overs are done, the innings closes instantly. In street cricket, the bowling team might have to bowl an extra ball due to a dispute.
* **You Are in Control:** The innings **never ends automatically**. Even if the overs are finished, the app waits for *you* to click "End Innings". This allows for last-minute corrections or "one more ball" scenarios.

### 4. ↩️ The "Argument Solver" (Undo & Redo)
* **Full History Stack:** Arguments are part of street cricket. "Was that last ball a wide?" "No, it touched the bat!"
* **Instant Revert:** Use the **Undo** button to revert the entire state (score, balls, wickets, extras history) instantly.
* **Redo:** If you realize you were right the first time, hit **Redo**.

### 5. 📉 Smart Calculations
* **Dynamic Target:** As soon as the 1st innings ends, the app automatically calculates the target and switches to "Chase Mode".
* **Required Run Rate (RRR):** In the 2nd innings, see exactly how many runs are needed per over to win.
* **Projected Scores:** See the Current Run Rate (CRR) updates ball-by-ball.

### 6. 🛡️ "Pocket-Safe" Read-Only Mode
* **Lock Previous Data:** Want to check the 1st innings score while batting in the 2nd? You can switch tabs to view the old scorecard in **Read-Only Mode**.
* **Safety Lock:** Prevents you from accidentally adding runs to the wrong team while checking stats.

### 7. 🎨 The "Vibe Check" UI
* **Dark Mode:** Perfect for night matches under floodlights (or streetlights).
* **Visual Timeline:** A horizontal ticker showing exactly what happened on every ball of the over (e.g., `1`, `WD+2`, `W`, `6`, `|`).
* **Haptic Feel:** Big, bold buttons designed for quick tapping without looking down constantly.

---

## ⚙️ Logic breakdown

| Scenario | Standard App Behavior | Sandhu Cricket Behavior |
| :--- | :--- | :--- |
| **Wide Ball Rule** | Always counts as Extra Ball | **Configurable:** Choose if Wide = Re-ball OR Run-only. |
| **Overs Finish** | Auto-closes innings | **Waits for User:** Allows adjustments before closing. |
| **Wicket on Extra** | Often confusing/Impossible | **Easy Toggle:** "Wicket Fell?" checkbox inside Extras menu. |
| **Team Size** | Fixed at 11 | **Flexible:** Tracks wickets purely as a count, not fixed to player slots. |
| **Data Loss** | Lost on refresh | **Persistent:** Auto-saves to Local Storage after every ball. |

---

### 🎮 Gameplay & Scoring
- **Flexible Rules:** Configure match overs (1-20) and custom rules for Wides and No-Balls (Re-ball vs. Run only).
- **Advanced Scoring Engine:** Handle complex scenarios like "Wide + Runs off bat" or "No Ball + Byes".
- **Undo/Redo System:** Full history stack allows you to undo mistakes and redo them if needed.
- **Timeline:** A visual scrolling ticker showing every ball history (e.g., `1`, `4`, `W`, `WD+2`).

### 🎨 UI/UX (Vibe Check)
- **Dark/Light Mode:** Seamless theme switching with persistent storage.
- **Responsive Design:** Optimized for mobile browsers to feel like a native app.
- **Smooth Animations:** Powered by simple CSS transitions and Tailwind utility classes.
- **Read-Only Mode:** Prevents accidental scoring when viewing past innings data.

### 🧠 Smart Logic
- **Persistence:** Automatically saves match state to Local Storage. Refreshing the page won't lose your score.
- **Auto-Conclusion:** Detects when overs are finished or a target is chased.
- **Innings Management:** Handles the transition between 1st and 2nd innings with a summary view.

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

## 📱 Made for the Streets. Built with Code.

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sandhu-cricket-web.git
   cd sandhu-cricket-web
   ```

2. **Install dependencies**
   ```bash
    npm install
    # or
    yarn install
   ```

3. **Start Scoring**
   ```bash
    npm run dev
    # or
    yarn dev
   ```



```bash

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx  
│   ├── globals.css
│   └── match/
│       └── page.tsx
├── components/
│   ├── Keypad.tsx
│   ├── Scoreboard.tsx
│   ├── Timeline.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useScoring.ts
└── types/
    └── index.ts
```