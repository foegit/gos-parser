const fs = require('fs');
const path = require('path');

function cleanQuestion(question) {
  const data = question.split('.');
  data.shift();
  return data.join('.').trim();
}

function cleanAnswer(answer) {
  console.log(answer);
  return (answer.slice(2).trim());
}

function parseTest(filepath, encoding='utf-8') {
  const result = {
    subject: '',
    count: 0,
    checked: true,
    questions: [],
  }

  console.log(
    filepath
  );

  try {
    const file = fs.readFileSync(filepath, encoding);
    const lines = file.split('\r\n');
    result.subject = lines.shift();
    lines.shift();

    for (let i = 0; i < lines.length; i += 6) {
      result.count += 1;
      result.questions.push(
        {
          question: cleanQuestion(lines[i]),
          index: (i / 6) + 1,
          answers: [
            {
              index: 1,
              title: cleanAnswer(lines[i + 1])
            },
            {
              index: 2,
              title: cleanAnswer(lines[i + 2])
            },
            {
              index: 3,
              title: cleanAnswer(lines[i + 3])
            },
            {
              index: 4,
              title: cleanAnswer(lines[i + 4])
            },
          ],
          checked: true,
        }
      )
    }
    const filename = path.basename(filepath).replace(/\.[^/.]+$/, "");
    const outPath = path.join('output', `${filename}.out.json`);
    const outData = JSON.stringify(result, null, 2);
    fs.writeFileSync(outPath, outData);
    return result;
  } catch (err) {
    console.log(err);
  }
}

function parseDir(dataDirFilePath) {
  const filenames = fs.readdirSync(dataDirFilePath);
  let t = 0;
  filenames.forEach((file) => {
    t += parseTest(path.join(dataDirFilePath, file)).count;
  })
}

// parseTest('./data/diffur.txt');
parseDir('data');

