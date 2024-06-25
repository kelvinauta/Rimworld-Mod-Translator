# Rimworld Mod Translator

Translate your Rimworld mods into your desired language.

This script creates an exact copy of a Rimworld mod folder while translating specific XML tags into a target language. The process ensures only user-visible labels are translated to prevent any malfunction, maintaining the mod's integrity and functionality.

## How It Works

- Copies an "input" folder to an "output" folder.
- Recursively searches for XML files within the folder.
- Selects text from specific XML tags for translation - not the entire XML content, to avoid operational errors.
- Utilizes the deepl.com API for translations.
- Rewrites the files into an "output" folder with the translated text.

## Instructions

0. Clone This Repo
1. Create an `input` folder in this folder and place the Rimworld mod you want to translate inside.
2. Create an `output` folder in this folder, initially empty.
3. Create a `.env` file with `DEEPL_API_KEY` and `TARGET_LANG` variables, adding your corresponding API key and target language.
4. Execute `npm i` followed by `node index.js`.
5. Wait for the translation to complete.
6. It's recommended to change the title in `About.xml` to distinguish between the translated mod and the original in-game, e.g., "Mod Name [Translated to Spanish]".
7. Copy the output to your Rimworld mods folder to use the translated mod.

## Advanced Configuration

In the `index.js` script, there's an array named `xml_tags_to_translate` where you can specify tags you want to translate. By default, `description` and `label` are included, covering most user-visible content.

## Considerations

- DEEPL's API has a free plan, but it's limited. For example, translating an extensive mod like Vanilla Expanded Ideology Memes consumed 375,000 of the 500,000 free characters.
- Colored texts might not look aesthetically pleasing post-translation due to special tags, though they remain understandable.
- Not all user-visible XML tags are known. Currently identified tags include `label`, `description`, and `thoughtStageDescriptions`, but there might be more.

## Limitations, Contributions, and TODOs

This is a list of limitations and potential improvements for this script:
- Add alternative translation engines, such as Google Translate or LLM-based AI translations like OpenAI.
- Implement parallel translation for a faster process, particularly useful for verbose mods.
- Improve text recognition, possibly using regular expressions, to address issues like color-coded texts.
- Address other undetected errors and potential enhancements.

## Developer's Note

This tool was developed for personal use but shared for potential help to others. I am not a Rimworld mod developer (yet), so this translation method might not be "correct" but has proven effective. Due to time constraints, I may not update this script but will review and accept PRs, encouraging forks for further development.