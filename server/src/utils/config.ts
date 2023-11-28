import _ from 'lodash';
import path from 'path';
import dotenv from 'dotenv';

type LoadFunc = () => Record<string, any>;

type Options = {
  path?: string | string[];
  loads?: Array<LoadFunc> | LoadFunc;
  options?: Omit<dotenv.DotenvConfigOptions, 'path'>;
};

export class Config {
  protected internalConfig: Record<string, any> = {};

  constructor(options: Options) {
    options = _.defaultsDeep(options, {
      loads: [],
      path: path.join(process.cwd(), '.env'),
    });

    // load env file
    this.loadEnvFile(options.path, options.options);
    // load function and merge with storage
    this.internalConfig = _.merge(
      this.internalConfig,
      this.loadFunc(options.loads),
    );
  }

  private getValue(key: string) {
    return process.env[key] ?? '';
  }

  get<T = any>(key: string, defaultValue?: T) {
    const value = _.get(this.internalConfig, key, defaultValue) as T;
    if (!_.isUndefined(value)) return value;

    const processEnvValue = this.getFromProcessEnv<T>(key, defaultValue);

    if (!_.isUndefined(processEnvValue)) return processEnvValue;

    return defaultValue as T;
  }

  getOrThrow<T = any>(key: string, defaultValue?: T) {
    const value = this.get(key, defaultValue) as T | undefined;

    if (_.isUndefined(value))
      throw new TypeError(`Configuration key "${key}" does not exist`);

    return value as Exclude<T, undefined>;
  }

  private getFromProcessEnv<T = any>(key: string, defaultValue?: T) {
    return (_.has(process.env, key) ? this.getValue(key) : defaultValue) as T;
  }

  private loadFunc(loads: LoadFunc[] | LoadFunc) {
    // load function
    let config: Record<string, any> = {};
    // if, load is array
    if (Array.isArray(loads)) {
      loads.forEach((load) => {
        // check load is function
        if (typeof load !== 'function') throw new Error('load is not function');
        // deep marge
        config = _.merge(config, load());
      });
    } else if (typeof loads === 'function') config = loads();

    return config;
  }

  private loadEnvFile(
    paths: string | string[],
    options?: Omit<dotenv.DotenvConfigOptions, 'path'>,
  ) {
    // if, path is array
    if (Array.isArray(paths)) {
      paths.forEach((path) => {
        const { error } = dotenv.config({ ...options, path });
        // throw errors
        if (error) throw error;
      });
    }

    // path is string
    else {
      const { error } = dotenv.config({
        ...options,
        path: paths,
      });
      // throw errors
      if (error) throw error;
    }
  }
}
