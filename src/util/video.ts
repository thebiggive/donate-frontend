export class VideoService {
  static getEmbedHtml(url) {
    if (url.match(/youtube\.com/g)) {
      return '<iframe src="' + url + '"></iframe>';
    } else {
      return '<video controls src=' + url + '></video>';
    }
  }
}
