export class VideoService {
  static getEmbedHtml(url) {
    if (url.match(/youtube\.com/g)) {
      return '<iframe loading="lazy" src="' + url + '"></iframe>';
    } else {
      return '<video controls src=' + url + '></video>';
    }
  }
}
