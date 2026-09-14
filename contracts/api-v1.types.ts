/* Generated from backend/contracts/api-v1.json. Do not edit field lists manually. */
export type ApiContractVersion = "1.0.0";
export type ApiResource = "content" | "page" | "researchPaper" | "paperAuthor" | "researchSection" | "media" | "visual" | "ad" | "permissionGrant";
export type ApiOperation = "create" | "update" | "list" | "counts";
export type ApiResourceFields = {
  content: "title"|"slug"|"contentType"|"excerpt"|"content"|"contentFormat"|"language"|"status"|"visibility"|"featured"|"pinned"|"allowComments"|"allowSharing"|"readingTime"|"wordCount"|"authorId"|"coverMediaId"|"thumbnailMediaId"|"publishedAt"|"scheduledAt"|"deletedAt"|"metadataJson";
  page: "title"|"slug"|"pageType"|"status"|"content"|"contentFormat"|"customCss"|"customJs"|"headerCode"|"footerCode"|"publishedAt"|"coverMediaId";
  researchPaper: "contentId"|"title"|"abstract"|"journal"|"conference"|"publisher"|"publicationDate"|"doi"|"arxivId"|"pmid"|"paperUrl"|"pdfUrl"|"field"|"paperType"|"methodology"|"license"|"citation"|"status";
  paperAuthor: "researchPaperId"|"authorName"|"affiliation"|"orcid"|"authorOrder";
  researchSection: "researchPaperId"|"parentId"|"title"|"slug"|"sectionOrder"|"depth"|"content"|"contentFormat";
  media: "filename"|"originalName"|"mimeType"|"mediaType"|"storageUrl"|"thumbnailUrl"|"altText"|"caption"|"width"|"height"|"fileSize"|"duration"|"metadata"|"status";
  visual: "title"|"visualType"|"mediaId"|"caption"|"altText"|"description"|"credit"|"sourceUrl"|"metadata";
  ad: "name"|"placement"|"adType"|"content"|"mediaId"|"targetType"|"targetId"|"priority"|"status"|"startAt"|"endAt"|"metadata";
  permissionGrant: "roleId"|"permissionId";
};
export type ApiField<R extends ApiResource> = ApiResourceFields[R];
