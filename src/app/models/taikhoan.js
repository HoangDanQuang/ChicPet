const mongoes = require ('mongoose')
const Schema = mongoes.Schema

const taikhoanSchema = new Schema({
    TenDangNhap: {
        type: String
    },
    MatKhau: {
        type: String
    },
    HoTen: {
        type: String
    },
    SoDienThoai: {
        type: String
    },
    Mail: {
        type: String
    }
},)

const TaiKhoan = mongoes.model('TaiKhoan', taikhoanSchema)
module.exports = TaiKhoan