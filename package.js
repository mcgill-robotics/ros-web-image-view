const packager = require('electron-packager');

packager({
  dir: '.',
  name: 'web_image_view',
  appCopyright: 'McGill Robotics',
  icon: './src/resources/icons/ros.ico',
  prune: false,
  quiet: true,
  tmpdir: false,
  out: './release',
  overwrite: true,
}, (err) => {
  if (err) {
    console.error(err);
  }
});
