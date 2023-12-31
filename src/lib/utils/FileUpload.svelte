<script lang="ts">
  import { FileState } from "./FileState";
  import { handleError } from "./errors/handleError";
  import { getFileExtension, parseCSV } from "./parse/uploads";
  import { output, headers } from "../stores/FileData";
  import { unwantedHeaders } from "./unwantedHeaders";
  import { state } from "../stores/UploadState";

  let data = $output.length ? JSON.stringify($output) : "[{}]";
  let allowedFormats = [".csv", ".json"];

  function parseHeaders(orig: any) {
    const origHeaders = Object.keys(orig);

    let result: string[] = [];

    origHeaders.forEach((header) => {
      if (unwantedHeaders.includes(header)) return;

      result.push(header);
    });
    return result;
  }

  $: {
    try {
      $output = JSON.parse(data);
      // $headers = Object.keys($output[0]);
      $headers = parseHeaders($output[0]);

      if ($output.length && $headers.length) {
        // localStorage.headers = JSON.stringify($headers);
        // localStorage.output = JSON.stringify($output);
        $state = FileState.loaded;
      }
    } catch (err) {
      $state = FileState.waiting;
      handleError(undefined, "Failed to parse. Please check the file.");
    }
  }

  function processFile(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    try {
      handleFileInput(ev);
      $state = FileState.loading;
    } catch (err) {
      $state = FileState.waiting;
      throw err;
    }
  }

  function handleFileInput(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    const el = ev.target as HTMLInputElement;
    const upload = el.files?.[0];
    if (!upload) {
      throw new Error("No file was uploaded");
    }
    const extension = getFileExtension(upload.name);
    if (!allowedFormats.includes(extension)) {
      throw new Error("Invalid file type. Please upload a .csv or .json file");
    }
    if (extension == ".json") {
      readJSON(upload);
    } else if (extension == ".csv") {
      readCSV(upload);
    }
  }

  function readJSON(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (!result) {
        throw new Error("No JSON result");
      }
      data = result.toString() as string;
    };
    reader.onerror = (event) => {
      throw new Error(event.target?.error?.message);
    };
    reader.readAsText(file);
  }

  function readCSV(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = parseCSV(event.target?.result?.toString() as string);
      $headers = result[0];
      data = JSON.stringify(result[1]);
    };
    reader.onerror = (event) => {
      throw new Error(event.target?.error?.message);
    };
    reader.readAsText(file);
  }
</script>

<label class="label min-w-fit">
  <span class="label-text px-3">Upload File</span>
</label>
<div class="form-control w-full max-w-xs place-self-center">
  <input
    type="file"
    accept={allowedFormats.toString()}
    class="file-input file-input-bordered w-full max-w-xs"
    on:change={processFile}
  />
</div>
