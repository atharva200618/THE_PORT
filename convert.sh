#!/bin/bash
# Usage: ./convert.sh input_file output_file
# The Port — Native Apple Silicon Conversion Engine

INPUT="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
OUTPUT_DIR="$(cd "$(dirname "$2")" && pwd)"
OUTPUT="$OUTPUT_DIR/$(basename "$2")"

IN_EXT="$(echo "${INPUT##*.}" | tr '[:upper:]' '[:lower:]')"
OUT_EXT="$(echo "${OUTPUT##*.}" | tr '[:upper:]' '[:lower:]')"

echo "Converting: $INPUT ($IN_EXT) -> $OUTPUT ($OUT_EXT)"

PYTHON_BIN="/tmp/pdf2docx_env/bin/python"
if [ ! -x "$PYTHON_BIN" ]; then
    PYTHON_BIN="python3"
fi

SOFFICE="/opt/homebrew/bin/soffice"
if [ ! -x "$SOFFICE" ] && command -v soffice >/dev/null 2>&1; then
    SOFFICE="soffice"
fi

ENGINE_SCRIPT="$(cd "$(dirname "$0")" && pwd)/pdf_converter_engine.py"

# Helper: pre-launch an Apple app and wait for it to be fully ready
pre_launch_app() {
    local APP_NAME="$1"
    local APP_PATH="$2"
    # Check if already running
    if ! pgrep -x "$APP_NAME" > /dev/null 2>&1; then
        echo "  [Engine] Pre-launching $APP_NAME..."
        open -a "$APP_PATH" 2>/dev/null
        sleep 5
    else
        sleep 1
    fi
}

# ==============================================================================
# 1. APPLE PAGES SUITE (.pages <-> .docx, .pdf)
# ==============================================================================
if [ "$IN_EXT" = "pdf" ] && [ "$OUT_EXT" = "pages" ]; then
    echo "  (PDF -> Pages via Precision Engine)"
    TEMP_DOCX="$OUTPUT_DIR/.tmp_$(basename "${INPUT%.*}")_$$.docx"
    "$PYTHON_BIN" "$ENGINE_SCRIPT" "$INPUT" "$TEMP_DOCX" 2>&1

    if [ -f "$TEMP_DOCX" ]; then
        pre_launch_app "Pages" "/Applications/Pages.app"
        osascript -e "
        tell application \"/Applications/Pages.app\"
            activate
            delay 3
            open POSIX file \"$TEMP_DOCX\"
            delay 4
            save front document in POSIX file \"$OUTPUT\"
            delay 2
            close front document saving no
        end tell" 2>&1
        rm -f "$TEMP_DOCX"
    fi

elif [ "$OUT_EXT" = "pages" ]; then
    pre_launch_app "Pages" "/Applications/Pages.app"
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        save front document in POSIX file \"$OUTPUT\"
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "pages" ] && [ "$OUT_EXT" = "pdf" ]; then
    pre_launch_app "Pages" "/Applications/Pages.app"
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as PDF
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "pages" ] && [ "$OUT_EXT" = "docx" ]; then
    pre_launch_app "Pages" "/Applications/Pages.app"
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as Microsoft Word
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "pdf" ] && [ "$OUT_EXT" = "docx" ]; then
    echo "  (PDF -> Word via Precision Engine)"
    "$PYTHON_BIN" "$ENGINE_SCRIPT" "$INPUT" "$OUTPUT" 2>&1

# ==============================================================================
# 2. APPLE KEYNOTE SUITE (.key <-> .pptx, .pdf)
# ==============================================================================
elif [ "$OUT_EXT" = "key" ]; then
    pre_launch_app "Keynote" "/Applications/Keynote.app"
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        save front document in POSIX file \"$OUTPUT\"
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "key" ] && [ "$OUT_EXT" = "pptx" ]; then
    pre_launch_app "Keynote" "/Applications/Keynote.app"
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as Microsoft PowerPoint
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "key" ] && [ "$OUT_EXT" = "pdf" ]; then
    pre_launch_app "Keynote" "/Applications/Keynote.app"
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as PDF
        delay 2
        close front document saving no
    end tell" 2>&1

# ==============================================================================
# 3. APPLE NUMBERS SUITE (.numbers <-> .xlsx, .csv, .pdf)
# ==============================================================================
elif [ "$OUT_EXT" = "numbers" ]; then
    pre_launch_app "Numbers" "/Applications/Numbers.app"
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        save front document in POSIX file \"$OUTPUT\"
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "xlsx" ]; then
    pre_launch_app "Numbers" "/Applications/Numbers.app"
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as Microsoft Excel
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "csv" ]; then
    pre_launch_app "Numbers" "/Applications/Numbers.app"
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as CSV
        delay 2
        close front document saving no
    end tell" 2>&1

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "pdf" ]; then
    pre_launch_app "Numbers" "/Applications/Numbers.app"
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 3
        open POSIX file \"$INPUT\"
        delay 4
        export front document to POSIX file \"$OUTPUT\" as PDF
        delay 2
        close front document saving no
    end tell" 2>&1

# ==============================================================================
# 4. FALLBACK / HEADLESS LIBREOFFICE ENGINE
# ==============================================================================
else
    "$SOFFICE" --headless --convert-to "$OUT_EXT" --outdir "$OUTPUT_DIR" "$INPUT"
    GENERATED="$OUTPUT_DIR/$(basename "${INPUT%.*}").$OUT_EXT"
    if [ "$GENERATED" != "$OUTPUT" ] && [ -f "$GENERATED" ]; then
        mv "$GENERATED" "$OUTPUT"
    fi
fi

# Final output check
if [ ! -f "$OUTPUT" ]; then
    echo "Warning: Output file $OUTPUT was not generated directly."
fi

echo "Done."
