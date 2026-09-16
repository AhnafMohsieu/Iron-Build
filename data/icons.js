// data/icons.js — Central Icon Map (Noto Emoji PNGs)
// Every icon KEY → emoji character + Unicode codepoint for PNG filename.
// PNG files live in assets/icons/emoji_u{code}.png

/* KEY → emoji character (plain-text contexts: placeholders, labels) */
var GYM_EMOJI = {
  'dumbbell':'🏋', 'muscle':'💪', 'leg':'🦵', 'back-arrow':'🔙',
  'flame':'🔥', 'zap':'⚡', 'target':'🎯', 'trophy':'🏆',
  'medal':'🏅', 'chart':'📊', 'calendar':'📅', 'calendar-check':'📆',
  'calendar-days':'🗓', 'infinity':'infinity', 'swords':'⚔', 'scales':'⚖',
  'gear':'⚙', 'check':'✅', 'pin':'📌', 'lock':'🔒',
  'link':'🔗', 'acrobatic':'🤸', 'runner':'🏃', 'bricks':'🧱',
  'shopping':'🛍', 'user':'👤', 'key':'🗝', 'crown':'👑',
  'label':'🏷', 'refresh':'🔄', 'walker':'🚶', 'rowing':'🚣',
  'cycling':'🚴', 'butterfly':'🦋', 'star':'⭐', 'fire':'🔥',
  'skull':'💀', 'heart':'❤', 'brain':'🧠', 'bone':'🦴',
  'flexed':'💪', 'clap':'👏', 'raised':'🙌', 'eye':'👁',
  'sparkle':'✨', 'diamond':'💠', 'gem':'💎', 'shield':'🛡',
  'sword':'⚔', 'wand':'🪄', 'rocket':'🚀', 'seedling':'🌱',
  'sun':'☀', 'moon':'🌙', 'cloud':'☁', 'bolt':'⚡',
  'water':'💧', 'leaf':'🍃', 'tree':'🌳', 'mountain':'⛰',
  'wave':'🌊', 'star2':'⭐', 'awarded':'🥇', 'bicep':'💪'
};

/* KEY → uppercase hex codepoint for emoji_u{code}.png filename */
var GYM_CODES = {
  'dumbbell':'1F3CB', 'muscle':'1F4AA', 'leg':'1F9B5', 'back-arrow':'1F519',
  'flame':'1F525', 'zap':'26A1', 'target':'1F3AF', 'trophy':'1F3C6',
  'medal':'1F3C5', 'chart':'1F4CA', 'calendar':'1F4C5', 'calendar-check':'1F4C6',
  'calendar-days':'1F5D3', 'infinity':'267E', 'swords':'2694', 'scales':'2696',
  'gear':'2699', 'check':'2705', 'pin':'1F4CC', 'lock':'1F512',
  'link':'1F517', 'acrobatic':'1F938', 'runner':'1F3C3', 'bricks':'1F9F1',
  'shopping':'1F6CD', 'user':'1F464', 'key':'1F5DD', 'crown':'1F451',
  'label':'1F3F7', 'refresh':'1F504', 'walker':'1F6B6', 'rowing':'1F6A3',
  'cycling':'1F6B4', 'butterfly':'1F98B', 'star':'2B50', 'fire':'1F525',
  'skull':'1F480', 'heart':'2764', 'brain':'1F9E0', 'bone':'1F9B4',
  'flexed':'1F4AA', 'clap':'1F44F', 'raised':'1F64C', 'eye':'1F441',
  'sparkle':'2728', 'diamond':'1F4A0', 'gem':'1F48E', 'shield':'1F6E1',
  'wand':'1FA84', 'rocket':'1F680', 'seedling':'1F331', 'sun':'2600',
  'moon':'1F319', 'cloud':'2601', 'bolt':'26A1', 'water':'1F4A7',
  'leaf':'1F343', 'tree':'1F333', 'mountain':'26F0', 'wave':'1F30A',
  'star2':'2B50', 'awarded':'1F947', 'bicep':'1F4AA'
};

/* ID → KEY map for tabs, exercises, features, categories */
var GYM_IDS = {
  // Tab groups
  'workout':'dumbbell', 'quick':'zap', 'warmup':'flame', 'history':'calendar-check',
  'chest':'muscle', 'back':'back-arrow', 'legs':'leg', 'shoulders':'target',
  'arms':'muscle', 'core':'bricks', 'cardio':'runner', 'bodyweight':'acrobatic',
  'active':'target', 'prs':'trophy', 'daily':'calendar', 'weekly':'calendar-check',
  'monthly':'calendar-days', 'lifetime':'infinity', 'calendar':'calendar',
  'stats':'chart', 'body':'scales', 'achievements':'medal', 'shop':'shopping',
  'settings':'gear', 'profile':'user',

  // Categories
  'today':'dumbbell', 'exercises':'muscle', 'goals':'target',
  'quests':'swords', 'progress':'chart', 'rewards':'trophy',

  // Exercise types
  'barbell':'dumbbell', 'dumbbell':'dumbbell', 'machine':'gear', 'cable':'link',
  'bodyweight':'acrobatic', 'cardio':'runner', 'kettlebell':'fire', 'band':'link',

  // Common
  'xp':'zap', 'level':'crown', 'streak':'flame', 'pr':'trophy',
  'quest':'swords', 'achievement':'medal', 'shop':'shopping',
  'export':'refresh', 'import':'refresh', 'reset':'refresh',
  'success':'check', 'locked':'lock', 'unlocked':'check'
};

/* fallback KEY used when nothing matches */
var GYM_FALLBACK = 'sparkle';

/* keyword auto-resolve for id strings */
var GYM_AUTO = [
  ['workout', 'dumbbell'], ['bench', 'dumbbell'], ['press', 'dumbbell'],
  ['squat', 'leg'], ['deadlift', 'bone'], ['curl', 'muscle'],
  ['row', 'rowing'], ['pull', 'muscle'], ['push', 'muscle'],
  ['lunge', 'leg'], ['raise', 'target'], ['crunch', 'abdominal'],
  ['plank', 'shield'], ['run', 'runner'], ['cycle', 'cycling'],
  ['swim', 'wave'], ['jump', 'acrobatic'], ['stretch', 'acrobatic'],
  ['warm', 'flame'], ['cool', 'cloud'], ['heavy', 'fire'],
  ['fast', 'zap'], ['slow', 'moon'], ['rest', 'moon'],
  ['goal', 'target'], ['record', 'trophy'], ['best', 'trophy'],
  ['daily', 'calendar'], ['weekly', 'calendar-check'], ['monthly', 'calendar-days'],
  ['body', 'scales'], ['weight', 'scales'], ['measure', 'scales'],
  ['stat', 'chart'], ['progress', 'chart'], ['track', 'chart'],
  ['shop', 'shopping'], ['buy', 'shopping'], ['cost', 'gem'],
  ['achieve', 'medal'], ['unlock', 'check'], ['reward', 'gem'],
  ['set', 'target'], ['rep', 'refresh'], ['milestone', 'crown'],
  ['fire', 'flame'], ['hot', 'fire'], ['burn', 'fire'],
  ['power', 'zap'], ['energy', 'zap'], ['speed', 'zap'],
  ['brain', 'brain'], ['mind', 'brain'], ['focus', 'eye'],
  ['heart', 'heart'], ['love', 'heart'], ['health', 'heart'],
  ['shield', 'shield'], ['guard', 'shield'], ['protect', 'shield'],
  ['sword', 'swords'], ['battle', 'swords'], ['fight', 'swords'],
  ['gem', 'gem'], ['rare', 'gem'], ['legend', 'crown'],
  ['star', 'star'], ['moon', 'moon'], ['sun', 'sun'],
  ['rock', 'mountain'], ['mountain', 'mountain'], ['nature', 'leaf'],
  ['tree', 'tree'], ['seed', 'seedling'], ['grow', 'seedling'],
  ['water', 'water'], ['drink', 'water'], ['wave', 'wave']
];

function _gymAutoResolve(key) {
  if (typeof key !== 'string') return '';
  var s = key.toLowerCase();
  for (var i = 0; i < GYM_AUTO.length; i++) {
    if (s.indexOf(GYM_AUTO[i][0]) !== -1) return GYM_AUTO[i][1];
  }
  return '';
}

/* Resolve: explicit map → keyword → fallback */
function _gymResolve(key) {
  if (typeof key !== 'string') key = '';
  return GYM_IDS[key] || _gymAutoResolve(key) || key;
}

function _gymFile(key) {
  var code = GYM_CODES[_gymResolve(key)];
  return code ? 'assets/icons/emoji_u' + code.toLowerCase() + '.png' : '';
}

/* HTML context — <img> tag with Noto Emoji PNG */
function gymIcon(key, cls) {
  var f = _gymFile(key);
  if (!f) return '';
  var k = _gymResolve(key);
  var className = cls || 'gym-icon';
  return '<img class="' + className + '" src="' + f + '" alt="' + (GYM_EMOJI[k] || '') + '" role="img" aria-label="' + key + '" loading="lazy">';
}

/* Plain-text context — the emoji character itself */
function gymEmoji(key) {
  return GYM_EMOJI[_gymResolve(key)] || '';
}

/* Resolve the PNG path for a key */
function gymSrc(key) { return _gymFile(key); }

window.GYM_EMOJI = GYM_EMOJI;
window.GYM_CODES = GYM_CODES;
window.GYM_IDS = GYM_IDS;
window.gymIcon = gymIcon;
window.gymEmoji = gymEmoji;
window.gymSrc = gymSrc;
