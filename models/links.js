'use strict';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const linkSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'New Link'
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },

    favIcon: {
      type: String
    },

    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const Links = mongoose.model('Links', linkSchema);

export default mongoose.models.Links || Links;
