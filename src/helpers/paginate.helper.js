export default class PaginateHelper {
  createParameterPaginate({page, limit}) {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    return {
      page,
      limit,
      skip: parseInt((page - 1) * limit)
    }
  }

  createMeta({limit, totalData, page}) {
    return {
      limit,
      totalData,
      currentPage: page,
      totalPage: Math.ceil(totalData / limit),
    }
  }
}
