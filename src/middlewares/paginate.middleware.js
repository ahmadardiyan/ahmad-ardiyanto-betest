import PaginateHelper from "../helpers/paginate.helper.js";

export default class PaginateMiddleware {
  constructor() {
    this.paginateHelper = new PaginateHelper()
  }

  async paginate(req, res, next) {
    const { query } = req
    const {
      page, limit
    } = query

    const result = this.paginateHelper.createParameterPaginate({page, limit})

    delete query.page;
    delete query.limit;

    req.query = {
      ...query,
      ...result
    }

    next();
  }
}