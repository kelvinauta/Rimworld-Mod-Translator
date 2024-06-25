const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const xml2js = require('xml2js');
const chalk = require('chalk');
require('dotenv').config();
class Translator {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async translateText(text, targetLang = process.env.TARGET_LANG) {
        const response = await axios.post('https://api-free.deepl.com/v2/translate', {
            text: [text],
            target_lang: targetLang
        }, {
            headers: {
                'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.translations[0].text;
    }

    async translateXML(filePath) {
        const xmlData = await fs.readFile(filePath, 'utf8');
        const parser = new xml2js.Parser();
        const builder = new xml2js.Builder();
        const result = await parser.parseStringPromise(xmlData);
        for (const key in result) {
        	
            if (result.hasOwnProperty(key)) {
                result[key] = await this.translateCore(result[key]);
            }
        }

        return builder.buildObject(result);
    }

    async translateCore(obj, validate_xml_label) {
        if (typeof obj === 'string' && validate_xml_label) {
            const translatedText = await this.translateText(obj);
            console.log(chalk.yellow(obj) + ' -> ' + chalk.green(translatedText));
            return translatedText;
        } else if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = await this.translateCore(obj[i], validate_xml_label);
            }
            return obj;
        } else if (typeof obj === 'object') {
            for (const key in obj) {
            	const xml_tags_to_translate=[
                    // They are the XML tags that will be translated recursively downwards
            		"label",
            		"description",
            		"thoughtStageDescriptions"
            	]
            	const validate_xml_tag = xml_tags_to_translate.find((xml_tag)=>xml_tag==key)
                if (obj.hasOwnProperty(key)) {
                    obj[key] = await this.translateCore(obj[key], validate_xml_tag);
                }
            }
            return obj;
        }
        return obj;
    }
}

async function processDirectory(inputDir, outputDir, translator) {
    await fs.copy(inputDir, outputDir);
    const files = await fs.readdir(inputDir);

    for (const file of files) {
        const fullPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);

        if ((await fs.stat(fullPath)).isDirectory()) {
            await processDirectory(fullPath, outputPath, translator);
        } else if (path.extname(file) === '.xml') {
            const translatedXML = await translator.translateXML(fullPath);
            await fs.writeFile(outputPath, translatedXML, 'utf8');
        }
    }
}

async function main() {
    const inputDir = 'input';
    const outputDir = 'output';
    const apiKey = process.env.DEEPL_API_KEY;
    const translator = new Translator(apiKey);

    console.log('Starting translation process...');
    await processDirectory(inputDir, outputDir, translator);
    console.log('Translation process completed!');
}

main().catch(console.error);
