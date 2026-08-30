#!/bin/bash
# Usage: ./convert.sh input_file output_file

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

# ==============================================================================
# 1. APPLE PAGES SUITE (.pages <-> .docx, .pdf)
# ==============================================================================
if [ "$IN_EXT" = "pdf" ] && [ "$OUT_EXT" = "pages" ]; then
    TEMP_DOCX="$OUTPUT_DIR/.tmp_$(basename "${INPUT%.*}")_$$.docx"
    echo "  (PDF -> Pages via Precision Engine)"
    "$PYTHON_BIN" "$ENGINE_SCRIPT" "$INPUT" "$TEMP_DOCX" 2>&1

    if [ -f "$TEMP_DOCX" ]; then
        osascript -e "
        tell application \"/Applications/Pages.app\"
            activate
            delay 1
            open POSIX file \"$TEMP_DOCX\"
            delay 2
            save front document in POSIX file \"$OUTPUT\"
            close front document saving no
        end tell"
        rm -f "$TEMP_DOCX"
    fi

elif [ "$OUT_EXT" = "pages" ]; then
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        save front document in POSIX file \"$OUTPUT\"
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "pages" ] && [ "$OUT_EXT" = "pdf" ]; then
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as PDF
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "pages" ] && [ "$OUT_EXT" = "docx" ]; then
    osascript -e "
    tell application \"/Applications/Pages.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as Microsoft Word
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "pdf" ] && [ "$OUT_EXT" = "docx" ]; then
    echo "  (PDF -> Word via Precision Engine)"
    "$PYTHON_BIN" "$ENGINE_SCRIPT" "$INPUT" "$OUTPUT" 2>&1

# ==============================================================================
# 2. APPLE KEYNOTE SUITE (.key <-> .pptx, .pdf)
# ==============================================================================
elif [ "$OUT_EXT" = "key" ]; then
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        save front document in POSIX file \"$OUTPUT\"
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "key" ] && [ "$OUT_EXT" = "pptx" ]; then
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as Microsoft PowerPoint
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "key" ] && [ "$OUT_EXT" = "pdf" ]; then
    osascript -e "
    tell application \"/Applications/Keynote.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as PDF
        close front document saving no
    end tell"

# ==============================================================================
# 3. APPLE NUMBERS SUITE (.numbers <-> .xlsx, .csv, .pdf)
# ==============================================================================
elif [ "$OUT_EXT" = "numbers" ]; then
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        save front document in POSIX file \"$OUTPUT\"
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "xlsx" ]; then
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as Microsoft Excel
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "csv" ]; then
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as CSV
        close front document saving no
    end tell"

elif [ "$IN_EXT" = "numbers" ] && [ "$OUT_EXT" = "pdf" ]; then
    osascript -e "
    tell application \"/Applications/Numbers.app\"
        activate
        delay 1
        open POSIX file \"$INPUT\"
        delay 2
        export front document to POSIX file \"$OUTPUT\" as PDF
        close front document saving no
    end tell"

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

# Fallback check: if output doesn't exist, log warning
if [ ! -f "$OUTPUT" ]; then
    echo "Warning: Output file $OUTPUT was not generated directly."
fi

echo "Done."
