import { FirebaseSingleton } from "../services/firebaseSingleton";
import * as fs from "fs";

export class RoutesList {

  static async getAll() {
    const fst = await FirebaseSingleton.GetInstance();

    const pages = [
      "/",
      "platform/all",
      "platform/ios",
      "platform/android",
      "platform/web",
      "platform/games"
    ];

    return fst.fs
      .collection("content")
      .get()
      .then((contentCollectionSnapshot: any) => {
        return Promise.all(
          contentCollectionSnapshot.docs.map((pageSnapshot: any) => {
            const repoPath = `projects/${this.getPath(pageSnapshot.id)}`;
            pages.push(repoPath);

            return pageSnapshot.ref
              .collection("pages")
              .get()
              .then((pagesCollectionSnapshot: any) => {
                pagesCollectionSnapshot.docs.forEach((subpageSnapshot: any) => {
                  pages.push(`${repoPath}/${this.getPath(subpageSnapshot.id)}`);
                });
              });
          })
        );
      })
      .then(() => {
        return pages;
        // return pages.map(page => {
        //   return page.toLowerCase();
        // });
      });
  }

  static getPath(id: string) {
    return id.replace(/::/g, "/");
  }
}

RoutesList.getAll().then((routes: string[]) => {
  const data = { routes };
  console.log("Found: " + routes.length);
  fs.writeFileSync("routes.json", JSON.stringify(data, undefined, 2));
}).then(() => {
  console.log("Done.");
  process.exit();
})

