const en = {
  login: {
    title: 'Sign in',
    subtitle: 'Welcome back to FocusMirror.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    errors: {
      invalidEmail: 'Enter a valid email address.',
      shortPassword: 'Password must be at least 6 characters.',
    },
  },
  home: {
    openMenu: 'Open menu',
    profile: 'Profile',
  },
  common: {
    sampleData: 'Sample data',
    duration: (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
    },
  },
  weekly: {
    title: 'This week',
    today: 'Today',
    change: (percent: number) =>
      percent === 0 ? 'Same as last week' : `${percent > 0 ? '↑' : '↓'} ${Math.abs(percent)}% vs last week`,
  },
  lastSession: {
    title: 'Last session',
    focusScore: 'focus score',
    duration: 'Duration',
    distractions: 'Distractions',
    postureWarnings: 'Posture alerts',
    viewReport: 'View report',
  },
  streak: {
    current: 'Current streak',
    longest: 'Best streak',
    days: (count: number) => (count === 1 ? '1 day' : `${count} days`),
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    used: 'used',
  },
  menu: {
    home: 'Home',
    settings: 'Settings',
    about: 'About',
    admin: 'Admin',
    signOut: 'Sign out',
    close: 'Close menu',
  },
  about: {
    title: 'About',
    tagline:
      'See how well you are really concentrating, and rest at the right time, using only your smartphone.',
    version: 'Version',
    sections: [
      {
        title: 'What it does',
        items: [
          'Estimates your focus level in real time with the front camera, from facial expression, how often you look away, and your posture and distance from the screen.',
          'Suggests a break when it detects a long stretch of exhaustion.',
          'Shows a report after every session: a focus graph, distraction count and posture warnings.',
          'Tracks weekly trends and your best time of day to focus, with streaks and goals to keep you going.',
        ],
      },
      {
        title: 'Who it is for',
        items: [
          'Students studying alone for exams or assignments.',
          'Self-learners and remote workers who spend long hours at a desk.',
        ],
      },
      {
        title: 'Why it is different',
        items: [
          'No wearables or sensors. Your phone is all you need.',
          'Breaks are based on how you are actually doing, not a fixed timer.',
          'Encourages healthy habits, including resting properly, not just working longer.',
        ],
      },
      {
        title: 'Privacy',
        items: [
          'All analysis runs on your device. Video is never stored or sent anywhere; only numerical scores are kept.',
        ],
      },
    ],
  },
  settings: {
    title: 'Settings',
    sections: {
      account: 'Account',
      focusSession: 'Focus session',
      notifications: 'Notifications',
      appearance: 'Appearance',
      privacy: 'Privacy & data',
    },
    rows: {
      editProfile: 'Edit profile',
      changePassword: 'Change password',
      dailyGoal: 'Daily focus goal',
      fatigueSensitivity: 'Fatigue sensitivity',
      restReminders: 'Rest reminders',
      postureWarnings: 'Posture warnings',
      recalibrateCamera: 'Recalibrate camera',
      allowNotifications: 'Allow notifications',
      sessionSounds: 'Session sounds',
      theme: 'Theme',
      language: 'Language',
      cameraPermission: 'Camera permission',
      exportData: 'Export my data',
      clearHistory: 'Clear session history',
    },
    values: {
      sensitivity: { low: 'Low', medium: 'Medium', high: 'High' },
      theme: { system: 'System', light: 'Light', dark: 'Dark' },
      cameraAllowed: 'Allowed',
      cameraNotAllowed: 'Not allowed',
      notCalibrated: 'Not yet',
    },
    clearConfirm: {
      title: 'Clear session history?',
      message: 'This deletes every recorded focus session. Your streak is kept. This cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Clear',
      done: 'Session history cleared.',
    },
    exportTitle: 'FocusMirror data',
    notificationsDenied: 'Notifications are turned off for FocusMirror. Turn them on in system settings.',
  },
  language: {
    title: 'Language',
    system: 'System default',
  },
  theme: {
    title: 'Theme',
  },
  editProfile: {
    title: 'Edit profile',
    name: 'Name',
    email: 'Email',
    save: 'Save',
    errors: {
      invalidEmail: 'Enter a valid email address.',
    },
  },
  changePassword: {
    title: 'Change password',
    current: 'Current password',
    new: 'New password',
    confirm: 'Confirm new password',
    save: 'Update password',
    updated: 'Password updated',
    errors: {
      missing: 'Fill in all fields.',
      shortPassword: 'New password must be at least 6 characters.',
      samePassword: 'New password must be different from your current password.',
      mismatch: 'New passwords do not match.',
    },
  },
  tabs: {
    home: 'Home',
    results: 'Result',
    session: 'Start session',
  },
  results: {
    title: 'Result',
    emptyTitle: 'No sessions yet',
    emptyBody: 'Finish a focus session to see your report here.',
  },
  session: {
    title: 'Start session',
    description: 'Your front camera estimates how focused you are while you work.',
    start: 'Start',
    cameraNeeded: 'FocusMirror needs the front camera to track your focus. Video stays on your device.',
    allowCamera: 'Allow camera',
    openSettings: 'Open settings',
  },
  admin: {
    title: 'Admin',
    sections: {
      streak: 'Usage streak',
    },
    currentStreak: 'Current streak',
    decrease: 'Decrease streak',
    increase: 'Increase streak',
    reset: 'Reset to 0',
    streakNote:
      'Rewrites the current run of used days so it ends today. Earlier history is kept. After a reset, today counts as used again the next time the app starts.',
  },
  dailyGoal: {
    title: 'Daily focus goal',
    section: 'Focus time per day',
    note: 'Pick a goal you can reach most days. Rest counts too: breaks are part of focusing well.',
  },
  fatigue: {
    title: 'Fatigue sensitivity',
    descriptions: {
      low: 'Suggests a break only after clear, sustained signs of fatigue. Fewer interruptions.',
      medium: 'A balance between staying in the flow and resting in time.',
      high: 'Suggests a break at the first signs of fatigue. Best for long study days.',
    },
  },
  calibrate: {
    title: 'Calibrate camera',
    instructions: 'Sit how you normally work and fit your face inside the outline.',
    start: 'Calibrate',
    hold: 'Hold still…',
    saved: 'Calibration saved',
    savedBody: 'FocusMirror will use this position as your baseline.',
    done: 'Done',
  },
};

export type Translations = typeof en;

const ja: Translations = {
  login: {
    title: 'ログイン',
    subtitle: 'FocusMirror へおかえりなさい。',
    email: 'メールアドレス',
    password: 'パスワード',
    signIn: 'ログイン',
    errors: {
      invalidEmail: '有効なメールアドレスを入力してください。',
      shortPassword: 'パスワードは6文字以上で入力してください。',
    },
  },
  home: {
    openMenu: 'メニューを開く',
    profile: 'プロフィール',
  },
  common: {
    sampleData: 'サンプルデータ',
    duration: (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return h === 0 ? `${m}分` : m === 0 ? `${h}時間` : `${h}時間${m}分`;
    },
  },
  weekly: {
    title: '今週',
    today: '今日',
    change: (percent: number) =>
      percent === 0 ? '先週と同じ' : `先週比 ${percent > 0 ? '↑' : '↓'}${Math.abs(percent)}%`,
  },
  lastSession: {
    title: '前回のセッション',
    focusScore: '集中スコア',
    duration: '時間',
    distractions: '気が散った回数',
    postureWarnings: '姿勢の警告',
    viewReport: 'レポートを見る',
  },
  streak: {
    current: '現在の連続記録',
    longest: '最長記録',
    days: (count: number) => `${count}日`,
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    previousMonth: '前の月',
    nextMonth: '次の月',
    used: '利用済み',
  },
  menu: {
    home: 'ホーム',
    settings: '設定',
    about: 'このアプリについて',
    admin: '管理者',
    signOut: 'ログアウト',
    close: 'メニューを閉じる',
  },
  about: {
    title: 'このアプリについて',
    tagline:
      'スマートフォンだけで、自分が本当にどれだけ集中できているかを知り、適切なタイミングで休憩できます。',
    version: 'バージョン',
    sections: [
      {
        title: 'できること',
        items: [
          'フロントカメラで表情、視線をそらした回数、姿勢や画面との距離から、集中度をリアルタイムで推定します。',
          '長時間の疲労を検出すると、休憩を提案します。',
          'セッションごとに、集中度のグラフ、気が散った回数、姿勢の警告をまとめたレポートを表示します。',
          '週ごとの傾向や集中しやすい時間帯を表示し、連続記録や目標でやる気を保てます。',
        ],
      },
      {
        title: '対象ユーザー',
        items: [
          '試験勉強や課題に一人で取り組む学生。',
          '長時間デスクで作業する独学者やリモートワーカー。',
        ],
      },
      {
        title: '特長',
        items: [
          'ウェアラブル端末やセンサーは不要。スマートフォンだけで使えます。',
          '休憩のタイミングは固定のタイマーではなく、実際の状態に基づいて決まります。',
          'ただ長く作業するのではなく、しっかり休むことも含めた健康的な習慣づくりをサポートします。',
        ],
      },
      {
        title: 'プライバシー',
        items: [
          'すべての分析は端末内で行われます。映像は保存も送信もされず、数値のスコアのみが記録されます。',
        ],
      },
    ],
  },
  settings: {
    title: '設定',
    sections: {
      account: 'アカウント',
      focusSession: '集中セッション',
      notifications: '通知',
      appearance: '外観',
      privacy: 'プライバシーとデータ',
    },
    rows: {
      editProfile: 'プロフィールを編集',
      changePassword: 'パスワードを変更',
      dailyGoal: '1日の集中目標',
      fatigueSensitivity: '疲労検出の感度',
      restReminders: '休憩リマインダー',
      postureWarnings: '姿勢の警告',
      recalibrateCamera: 'カメラを再キャリブレーション',
      allowNotifications: '通知を許可',
      sessionSounds: 'セッションのサウンド',
      theme: 'テーマ',
      language: '言語',
      cameraPermission: 'カメラへのアクセス',
      exportData: 'データをエクスポート',
      clearHistory: 'セッション履歴を削除',
    },
    values: {
      sensitivity: { low: '低', medium: '中', high: '高' },
      theme: { system: 'システム設定', light: 'ライト', dark: 'ダーク' },
      cameraAllowed: '許可済み',
      cameraNotAllowed: '未許可',
      notCalibrated: '未実施',
    },
    clearConfirm: {
      title: 'セッション履歴を削除しますか？',
      message: '記録されたすべての集中セッションが削除されます。連続記録は残ります。この操作は取り消せません。',
      cancel: 'キャンセル',
      confirm: '削除',
      done: 'セッション履歴を削除しました。',
    },
    exportTitle: 'FocusMirror のデータ',
    notificationsDenied: 'FocusMirror の通知がオフになっています。システム設定からオンにしてください。',
  },
  language: {
    title: '言語',
    system: 'システム設定に従う',
  },
  theme: {
    title: 'テーマ',
  },
  editProfile: {
    title: 'プロフィールを編集',
    name: '名前',
    email: 'メールアドレス',
    save: '保存',
    errors: {
      invalidEmail: '有効なメールアドレスを入力してください。',
    },
  },
  changePassword: {
    title: 'パスワードを変更',
    current: '現在のパスワード',
    new: '新しいパスワード',
    confirm: '新しいパスワード（確認）',
    save: 'パスワードを更新',
    updated: 'パスワードを更新しました',
    errors: {
      missing: 'すべての項目を入力してください。',
      shortPassword: '新しいパスワードは6文字以上にしてください。',
      samePassword: '新しいパスワードは現在のパスワードと異なるものにしてください。',
      mismatch: '新しいパスワードが一致しません。',
    },
  },
  tabs: {
    home: 'ホーム',
    results: '結果',
    session: 'セッション開始',
  },
  results: {
    title: '結果',
    emptyTitle: 'まだセッションがありません',
    emptyBody: '集中セッションを終えると、ここにレポートが表示されます。',
  },
  session: {
    title: 'セッション開始',
    description: 'フロントカメラで作業中の集中度を推定します。',
    start: '開始',
    cameraNeeded: '集中度を記録するためにフロントカメラを使用します。映像は端末の外に送信されません。',
    allowCamera: 'カメラを許可',
    openSettings: '設定を開く',
  },
  admin: {
    title: '管理者',
    sections: {
      streak: '利用の連続記録',
    },
    currentStreak: '現在の連続記録',
    decrease: '連続記録を減らす',
    increase: '連続記録を増やす',
    reset: '0にリセット',
    streakNote:
      '今日までの連続した利用日を書き換えます。それより前の履歴はそのまま残ります。リセットしても、次にアプリを起動したときに今日は利用日として記録されます。',
  },
  dailyGoal: {
    title: '1日の集中目標',
    section: '1日あたりの集中時間',
    note: 'ほとんどの日に達成できる目標を選びましょう。休憩も上手に集中するための大切な一部です。',
  },
  fatigue: {
    title: '疲労検出の感度',
    descriptions: {
      low: 'はっきりとした疲れが続いたときだけ休憩を提案します。中断が少なくなります。',
      medium: '集中を保つことと、適切なタイミングで休むことのバランスをとります。',
      high: '疲れの兆しが見えた時点で休憩を提案します。長時間の勉強に向いています。',
    },
  },
  calibrate: {
    title: 'カメラのキャリブレーション',
    instructions: 'いつも作業するときの姿勢で座り、顔を枠の中に合わせてください。',
    start: 'キャリブレーション',
    hold: 'そのまま動かないでください…',
    saved: 'キャリブレーションを保存しました',
    savedBody: 'この位置を基準として使用します。',
    done: '完了',
  },
};

export const translations = { en, ja };

export type Language = keyof typeof translations;

/** Each language's name, written in that language so it is recognizable whatever the current language is. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
};
