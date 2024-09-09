import chalk from "chalk";
import { Presets, SingleBar } from "cli-progress";

/**
 * Display a progress bar for file downloads
 */
export default function barInstance() {
    // initialze progress bar
    const bar = new SingleBar({
        format: `${chalk.white.dim("Downloading")}: ${chalk.cyan("{dValue}{dUnit}")} ${chalk.white.dim("of")} ${chalk.cyan("{sValue}{sUnit}")}`,
        hideCursor: true,
        clearOnComplete: true
    }, Presets.shades_classic)

    let first = true;

    return (args: DownloadCallbackArgs) => {

        const update = {
            dUnit: args.download.unit,
            dValue: args.download.value,
            sUnit: args.source.unit,
            sValue: args.source.value
        }

        // update the bar on successive calls
        if (!first) return bar.update(0, update)

        // start the bar on first run
        first = false
        bar.start(0, 0, update)
    }
}