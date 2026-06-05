/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** JobStatus */
export enum JobStatus {
  Applied = "Applied",
  Interviewing = "Interviewing",
  Rejected = "Rejected",
  Accepted = "Accepted",
}

/** Body_login_user_user_login_post */
export interface BodyLoginUserUserLoginPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /**
   * Password
   * @format password
   */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /**
   * Client Secret
   * @format password
   */
  client_secret?: string | null;
}

/** Body_reset_password_user_reset_password_post */
export interface BodyResetPasswordUserResetPasswordPost {
  /** Password */
  password: string;
}

/** CommonHTTPResponse */
export interface CommonHTTPResponse {
  /**
   * Detail
   * Success message details
   */
  detail: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** JobApplication */
export interface JobApplication {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Company */
  company: string;
  /** Position */
  position: string;
  /** Site */
  site: string;
  /** @default "Applied" */
  status?: JobStatus;
  /**
   * Date Applied
   * @format date-time
   */
  date_applied?: string;
  /**
   * Date Modified
   * @format date-time
   */
  date_modified?: string;
  /**
   * Is Deleted
   * @default false
   */
  is_deleted?: boolean;
  /**
   * User Email
   * @format email
   */
  user_email: string;
}

/** JobApplicationCreate */
export interface JobApplicationCreate {
  /**
   * Company
   * Name of the company applied to
   */
  company: string;
  /**
   * Position
   * Position applied for
   */
  position: string;
  /**
   * Site
   * Job listing site (e.g., LinkedIn, Indeed)
   */
  site?: string | null;
}

/** JobApplicationResult */
export interface JobApplicationResult {
  /**
   * Company
   * Name of the company applied to
   */
  company: string;
  /**
   * Position
   * Position applied for
   */
  position: string;
  /**
   * Site
   * Job listing site (e.g., LinkedIn, Indeed)
   */
  site?: string | null;
  /**
   * Id
   * Unique identifier for the job application
   * @format uuid
   */
  id: string;
  /**
   * Current status of the job application
   * @default "Applied"
   */
  status?: JobStatus;
  /**
   * Date Applied
   * Date when the application was submitted
   * @format date-time
   * @default "2026-06-05T13:29:44.227942"
   */
  date_applied?: string;
  /**
   * Date Modified
   * Date when the application was last updated
   * @format date-time
   * @default "2026-06-05T13:29:44.227963"
   */
  date_modified?: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
}

/** JobApplicationUpdate */
export interface JobApplicationUpdate {
  /** Current status of the job application */
  status?: JobStatus | null;
}

/** TokenData */
export interface TokenData {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** UserInput */
export interface UserInput {
  /** Firstname */
  firstName: string;
  /** Lastname */
  lastName: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Dob
   * @format date-time
   */
  dob: string;
  /** Password */
  password: string;
}

/** UserResult */
export interface UserResult {
  /** Firstname */
  firstName: string;
  /** Lastname */
  lastName: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Dob
   * @format date-time
   */
  dob: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title FastAPI
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name ReadRootGet
   * @summary Read Root
   * @request GET:/
   */
  readRootGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  jobsApplied = {
    /**
     * No description
     *
     * @tags Jobs Applied
     * @name GetJobsAppliedJobsAppliedGet
     * @summary Get Jobs Applied
     * @request GET:/jobs-applied/
     * @secure
     */
    getJobsAppliedJobsAppliedGet: (params: RequestParams = {}) =>
      this.request<JobApplicationResult[], any>({
        path: `/jobs-applied/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs Applied
     * @name CreateJobApplicationJobsAppliedPost
     * @summary Create Job Application
     * @request POST:/jobs-applied/
     * @secure
     */
    createJobApplicationJobsAppliedPost: (
      data: JobApplicationCreate,
      params: RequestParams = {},
    ) =>
      this.request<JobApplication, HTTPValidationError>({
        path: `/jobs-applied/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs Applied
     * @name GetJobApplicationJobsAppliedIdGet
     * @summary Get Job Application
     * @request GET:/jobs-applied/{id}
     * @secure
     */
    getJobApplicationJobsAppliedIdGet: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<JobApplicationResult, HTTPValidationError>({
        path: `/jobs-applied/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs Applied
     * @name UpdateJobApplicationJobsAppliedIdPatch
     * @summary Update Job Application
     * @request PATCH:/jobs-applied/{id}
     * @secure
     */
    updateJobApplicationJobsAppliedIdPatch: (
      id: string,
      data: JobApplicationUpdate,
      params: RequestParams = {},
    ) =>
      this.request<JobApplicationResult, HTTPValidationError>({
        path: `/jobs-applied/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Jobs Applied
     * @name DeleteJobApplicationJobsAppliedIdDelete
     * @summary Delete Job Application
     * @request DELETE:/jobs-applied/{id}
     * @secure
     */
    deleteJobApplicationJobsAppliedIdDelete: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<boolean, HTTPValidationError>({
        path: `/jobs-applied/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name GetCurrentProfileUserMeGet
     * @summary Get Current Profile
     * @request GET:/user/me
     * @secure
     */
    getCurrentProfileUserMeGet: (params: RequestParams = {}) =>
      this.request<UserResult, any>({
        path: `/user/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ForgotPasswordUserForgotPasswordGet
     * @summary Forgot Password
     * @request GET:/user/forgot_password
     */
    forgotPasswordUserForgotPasswordGet: (
      query: {
        /**
         * Email
         * @format email
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommonHTTPResponse, HTTPValidationError>({
        path: `/user/forgot_password`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name LogoutUserUserLogoutGet
     * @summary Logout User
     * @request GET:/user/logout
     * @secure
     */
    logoutUserUserLogoutGet: (params: RequestParams = {}) =>
      this.request<CommonHTTPResponse, any>({
        path: `/user/logout`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ResetPasswordFormUserResetPasswordFormGet
     * @summary Reset Password Form
     * @request GET:/user/reset_password_form
     */
    resetPasswordFormUserResetPasswordFormGet: (
      query: {
        /** Token */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/user/reset_password_form`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name VerifyUserEmailUserVerifyGet
     * @summary Verify User Email
     * @request GET:/user/verify
     */
    verifyUserEmailUserVerifyGet: (
      query: {
        /** Token */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CommonHTTPResponse, HTTPValidationError>({
        path: `/user/verify`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name LoginUserUserLoginPost
     * @summary Login User
     * @request POST:/user/login
     */
    loginUserUserLoginPost: (
      data: BodyLoginUserUserLoginPost,
      params: RequestParams = {},
    ) =>
      this.request<TokenData, HTTPValidationError>({
        path: `/user/login`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name RegisterUserUserRegisterPost
     * @summary Register User
     * @request POST:/user/register
     */
    registerUserUserRegisterPost: (
      data: UserInput,
      params: RequestParams = {},
    ) =>
      this.request<UserResult, HTTPValidationError>({
        path: `/user/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ResetPasswordUserResetPasswordPost
     * @summary Reset Password
     * @request POST:/user/reset_password
     */
    resetPasswordUserResetPasswordPost: (
      query: {
        /** Token */
        token: string;
      },
      data: BodyResetPasswordUserResetPasswordPost,
      params: RequestParams = {},
    ) =>
      this.request<CommonHTTPResponse, HTTPValidationError>({
        path: `/user/reset_password`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),
  };
}
