import fs from 'fs';
import crypto from 'crypto';

const TMP_LOC = 'tmpdata';

const write = (content, fileType) => {
    const timestamp = (new Date()).toISOString();
    const filename = `${TMP_LOC}/${crypto.createHash('md5').update(JSON.stringify(content)+timestamp).digest('hex')}.txt`;

    try {
        if (!fs.existsSync(TMP_LOC)) {
            fs.mkdirSync(TMP_LOC)
        }        

        const csvContents = (json) => {
            const lines = ["Symbol,Name,Value,Volume,Gains"];

            for (const i in json) {
                const obj = json[i];
                lines.push(`${obj.symbol},${obj.name},${obj.value},${obj.volume},${obj.gains}`);
            }

            return lines.join('\n');
        }

        const xmlContents = (json) => {
            const lines = ["<?xml version='1.0' encoding='UTF-8' ?>"];

            for (const i in json) {
                const obj = json[i];
                lines.push(
                `<Stock>\n`+
                `\t<Symbol>${obj.symbol}</Symbol>\n`+
                `\t<Name>${obj.name}</Name>\n`+
                `\t<Value>${obj.value}</Value>\n`+
                `\t<Volume>${obj.volume}</Volume>\n`+
                `\t<Gains>${obj.gains}</Gains>\n`+
                `</Stock>`);
            }

            return lines.join('\n');
        }

        const fileContents = (json) => {
            switch (fileType) {
                case 'csv':
                    return csvContents(json);
                case 'xml':
                    return xmlContents(json);
                default:
                    return "";
            }
        }

        fs.writeFileSync(filename, fileContents(content), { flag: 'w' });

        return '/' + filename;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const removeTmpFile = async (filename) => {
    fs.rm(filename, err => {
        if(err) {
            console.log(err);
            return;
        }
    });
}

export { write, removeTmpFile };