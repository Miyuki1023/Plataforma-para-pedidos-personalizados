const addressService = require('../services/address.service');

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await addressService.getUserAddresses(userId);
    res.json({
      addresses: addresses.map(addr => ({
        id: addr.id,
        direccion: addr.direccion,
        referencia: addr.referencia,
        id_distrito: addr.id_distrito,
        distrito: addr.distrito,
        nombre_direccion: addr.nombre_direccion,
        is_default: addr.is_default,
        fecha_creacion: addr.fecha_creacion
      }))
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return res.status(400).json({ message: 'ID de dirección inválido' });
    }

    const address = await addressService.getAddressById(userId, addressId);
    res.json({
      address: {
        id: address.id,
        direccion: address.direccion,
        referencia: address.referencia,
        id_distrito: address.id_distrito,
        distrito: address.distrito,
        nombre_direccion: address.nombre_direccion,
        is_default: address.is_default,
        fecha_creacion: address.fecha_creacion
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = await addressService.createAddress(userId, req.body);
    res.status(201).json({
      message: 'Dirección creada exitosamente',
      address: {
        id: address.id,
        direccion: address.direccion,
        referencia: address.referencia,
        id_distrito: address.id_distrito,
        distrito: address.distrito,
        nombre_direccion: address.nombre_direccion,
        is_default: address.is_default,
        fecha_creacion: address.fecha_creacion
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return res.status(400).json({ message: 'ID de dirección inválido' });
    }

    const updatedAddress = await addressService.updateAddress(userId, addressId, req.body);
    res.json({
      message: 'Dirección actualizada exitosamente',
      address: {
        id: updatedAddress.id,
        direccion: updatedAddress.direccion,
        referencia: updatedAddress.referencia,
        id_distrito: updatedAddress.id_distrito,
        distrito: updatedAddress.distrito,
        nombre_direccion: updatedAddress.nombre_direccion,
        is_default: updatedAddress.is_default,
        fecha_creacion: updatedAddress.fecha_creacion
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    if (isNaN(addressId)) {
      return res.status(400).json({ message: 'ID de dirección inválido' });
    }

    const result = await addressService.deleteAddress(userId, addressId);
    res.json({
      message: result.message,
      deletedAddress: {
        id: result.id,
        nombre_direccion: result.nombre_direccion
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const districts = await addressService.getDistricts();
    res.json({
      districts: districts.map(dist => ({
        id: dist.id,
        distrito: dist.distrito
      }))
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};