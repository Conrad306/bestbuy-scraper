import { load } from "cheerio";
import axios from "axios";
import fs from "fs";
const instance = axios.create();
const url = "https://bestbuy.com/site/searchpage.jsp?st=cpu+amd";
interface CpuInfo {
  name: string;
  price: string;
}
instance
  .get(url)
  .then((response) => {
    const html = response.data;
    const $ = load(html);
    const name = $("h4[class=sku-header]");
    const price = $(
      'div > div[class="priceView-hero-price priceView-customer-price"]'
    );
    const cpuInfo: CpuInfo[] = [];
    name.each((_i, elem) => {
      //grab the text element from the file
      const e = $(elem).text();
      price.each((_i, elem) => {
        //slice the random content that comes with it (Its something like "Your price is [x]")
        //also ik its bad to do it this way, with two inside each other, but if .each() returned a String and not a boolean i wouldn't be doing this
        const f = $(elem).text().slice(0, 7);
        cpuInfo.push({
          name: e,
          price: f,
        });
      });
    });
    //Write a txt file with the information
    fs.writeFile(
      "cpus.txt",
      cpuInfo
        //filter out cpus that aren't amd
        .filter((cpu) => cpu.name.toLowerCase().startsWith("amd"))
        .map((info) => `Name: ${info.name}\nPrice: ${info.price}\n`)
        .join("\n"),
      (err) => {
        if (err) console.error(err);
      }
    );
    console.log("I've Created a cpus.txt file, enjoy!");
  })
  .catch(console.error);
