const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const OwnerError = require('../errors/owner-err');
const { OWNER_ERROR, ARTICLE_NOT_FOUND_ERROR } = require('../configs/constants');

const getArticle = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById({ _id: articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError(ARTICLE_NOT_FOUND_ERROR);
      } else if (article.owner.toString() !== req.user._id) {
        throw new OwnerError(OWNER_ERROR);
      } else {
        Article.deleteOne({ _id: articleId })
          .then(() => res.send({ message: 'Статья удалена' }));
      }
    })
    .catch(next);
};

module.exports = {
  getArticle,
  createArticle,
  deleteArticle,
};
