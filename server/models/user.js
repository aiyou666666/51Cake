import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  role: {
    type: Number,
    default: 0
  },
  username: String,
  password: String,
  email: String,
  nickname: String,
  motto: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// 隐藏一些字段
UserSchema.options.toJSON = {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.id
  }
}
mongoose.model('User', UserSchema)
