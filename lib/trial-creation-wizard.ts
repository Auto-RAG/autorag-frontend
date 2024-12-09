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

const parseDefaultConfig = {
  modules: [
{
module_type: "langchain_parse",
file_type: "pdf", 
parse_method: "pypdfium2"
},
{
module_type: "langchain_parse",
file_type: "csv",
parse_method: "csv",
},
{
module_type: "langchain_parse",
file_type: "json",
parse_method: "json",
jq_schema: ".content"
},
{
module_type: "langchain_parse",
file_type: "md",
parse_method: "unstructuredmarkdown"
},
{
module_type: "langchain_parse",
file_type: "html",
parse_method: "bshtml"
},
{
module_type: "langchain_parse",
file_type: "xml",
parse_method: "unstructuredxml"
}
]
}

export const getParseConfig = (parseOption: ParseOptionEnum, lang: string) => {
    const optionDict = {
        default: parseDefaultConfig,
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
    cheap: parseDefaultConfig,
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
              chunk_size: 1024,
              chunk_overlap: 128
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
              chunk_method: "Token",
              chunk_size: 1024,
              chunk_overlap: 128
            }]
          },
          expensive: {
            modules: [{
              module_type: "llama_index_chunk",
              chunk_method: "Token",
              chunk_size: 1024,
              chunk_overlap: 128
            }]
          }
    }

    if (!(chunkOption in optionDict)) {
        throw new Error(`Invalid chunk option: ${chunkOption}`);
    }

    return optionDict[chunkOption];
}
