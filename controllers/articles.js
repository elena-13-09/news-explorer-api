const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const OwnerError = require('../errors/owner-err');

const getArticle = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword,
    text,
    name,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    text,
    name,
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
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статья не найдена');
      } else if (article.owner.toString() !== req.user._id) {
        throw new OwnerError('Нельзя удалить статью другого пользователя');
      } else {
        Article.findByIdAndDelete(req.params.articleId)
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
