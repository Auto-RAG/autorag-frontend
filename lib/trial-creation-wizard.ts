// Parse config

export enum ParseOptionEnum {
    DEFAULT = 'default',
    LLAMA_PARSE = 'llama_parse',
    CHEAP = 'cheap',
    EXPENSIVE = 'expensive'
}

export enum ChunkOptionEnum {
    DEFAULT = 'default',
    SEMANTIC = 'semantic',
    CHEAP = 'cheap',
    EXPENSIVE = 'expensive'
}

export const getParseConfig = (parseOption: ParseOptionEnum, lang: string) => {
    const optionDict = {
        default: {
            modules: [{
                module_type: "langchain_parse",
        file_type: "all_files", 
        parse_method: "directory"
      }]
    },
    llama_parse: {
      modules: [{
        module_type: "llamaparse",
        file_type: "all_files",
        result_type: "markdown", 
        language: lang,
        use_vendor_multimodal_model: true,
        vendor_multimodal_model_name: "openai-gpt-4o-mini"
      }]
    },
    cheap: {
        modules: [{
            module_type: "langchain_parse",
    file_type: "all_files", 
    parse_method: "directory"
        }]
    },
    expensive: {
        modules: [{
          module_type: "llamaparse",
          file_type: "all_files",
          result_type: "markdown", 
          language: lang,
          use_vendor_multimodal_model: true,
          vendor_multimodal_model_name: "openai-gpt-4o-mini"
        }]
      }
  }

  if (!(parseOption in optionDict)) {
    throw new Error(`Invalid parse option: ${parseOption}`);
  }

  return optionDict[parseOption];
}


export const getChunkConfig = (chunkOption: ChunkOptionEnum, lang: string) => {
    const optionDict = {
        default: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: "Token",
              chunk_size: 512,
              chunk_overlap: 50
            }]
          },
          semantic: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: "Semantic_llama_index",
              embed_model: "openai",
              buffer_size: 1,
              breakpoint_percentile_threshold: 95,
              add_file_name: lang
            }]
          },
          cheap: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: "SentenceWindow",
              window_size: 3,
              sentence_splitter: "kiwi",
              add_file_name: lang,
            }]
          },
          expensive: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: "Semantic_llama_index",
              embed_model: "openai",
              sentence_splitter: "kiwi",
              add_file_name: lang,
            }]
          }
    }

    if (!(chunkOption in optionDict)) {
        throw new Error(`Invalid chunk option: ${chunkOption}`);
    }

    return optionDict[chunkOption];
}
