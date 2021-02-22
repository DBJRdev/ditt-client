export default () => {
  const importAll = (r) => {
    r.keys().forEach((key) => { r(key); });
  };

  // Following path has to be updated when new icon is used
  importAll(require.context(
    '!svg-sprite-loader!material-design-icons/',
    true,
    /[\\/]svg[\\/]production[\\/]ic_(access_time|add|arrow_downward|arrow_upward|autorenew|beach_access|block|check_circle|child_friendly|content_copy|cancel|clear|edit|error|expand_less|expand_more|home|hourglass_empty|keyboard_arrow_left|keyboard_arrow_right|local_hospital|local_pharmacy|location_off|open_in_new|phonelink_off|play_arrow|pregnant_woman|send|stop|sync|thumb_up|train|update)_48px\.svg$/,
  ));
};
